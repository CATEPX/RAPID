from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import ssl
import socket
import urllib.parse
import re
import whois
import requests
import hashlib
import asyncio
from urllib.parse import urlparse
from contextlib import asynccontextmanager

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

try:
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'rapid_db')]
    mongo_available = True
except Exception as e:
    print(f"MongoDB connection failed: {e}")
    mongo_available = False
    client = None
    db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    client.close()

app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")

class URLAnalysisRequest(BaseModel):
    url: str

class SuspiciousPattern(BaseModel):
    pattern: str
    description: str
    severity: int

class URLAnalysisResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    trust_score: int
    is_legitimate: bool
    is_accessible: bool
    has_ssl: bool
    ssl_valid: bool
    domain_age_days: Optional[int]
    suspicious_patterns: List[SuspiciousPattern]
    analysis_summary: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

def normalize_url(url: str) -> str:
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    return url.lower().strip()

def check_ssl_certificate(url: str) -> tuple[bool, bool]:
    try:
        parsed_url = urlparse(url)
        if parsed_url.scheme != 'https':
            return False, False
        hostname = parsed_url.hostname
        port = parsed_url.port or 443
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                return True, cert is not None
    except Exception:
        return False, False

def check_accessibility(url: str) -> bool:
    try:
        response = requests.get(url, timeout=10, allow_redirects=True)
        return response.status_code == 200
    except Exception:
        return False

from datetime import datetime
from whois import whois  # ✅ Fixed import
import threading
import queue
from typing import Optional

def get_domain_age(domain: str) -> Optional[int]:
    try:
        domain = domain.lower().strip()
        if domain.startswith("www."):
            domain = domain[4:]

        result_queue = queue.Queue()

        def whois_lookup():
            try:
                result_queue.put(whois(domain))
            except Exception as e:
                result_queue.put(e)

        thread = threading.Thread(target=whois_lookup)
        thread.daemon = True
        thread.start()

        try:
            w = result_queue.get(timeout=6)
            if isinstance(w, Exception):
                raise w
        except queue.Empty:
            return None

        creation_date = w.creation_date or w.created
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        if not creation_date:
            return None
        if isinstance(creation_date, str):
            try:
                creation_date = datetime.fromisoformat(creation_date.replace("Z", "+00:00"))
            except:
                try:
                    creation_date = datetime.strptime(creation_date, "%Y-%m-%d")
                except:
                    return None

        return (datetime.now() - creation_date).days
    except Exception as e:
        print(f"WHOIS failed: {e}")
        return None

def detect_suspicious_patterns(url: str) -> List[SuspiciousPattern]:
    patterns = []
    parsed_url = urlparse(url)
    domain = parsed_url.hostname or ""
    path = parsed_url.path or ""
    full_url = url.lower()
    suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.pw', '.top', '.click', '.download']
    for tld in suspicious_tlds:
        if domain.endswith(tld):
            patterns.append(SuspiciousPattern(pattern=f"Suspicious TLD: {tld}", description=f"Domain uses potentially suspicious top-level domain {tld}", severity=7))
    ip_pattern = re.compile(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b')
    if ip_pattern.search(domain):
        patterns.append(SuspiciousPattern(pattern="IP address as domain", description="Uses IP address instead of domain name", severity=8))
    if domain.count('.') > 3:
        patterns.append(SuspiciousPattern(pattern="Excessive subdomains", description=f"Domain has {domain.count('.')} dots, indicating multiple subdomains", severity=6))
    shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link']
    for shortener in shorteners:
        if shortener in domain:
            patterns.append(SuspiciousPattern(pattern=f"URL shortener: {shortener}", description="Uses URL shortening service which can hide destination", severity=5))
    suspicious_keywords = ['login', 'verify', 'update', 'secure', 'account', 'bank', 'paypal', 'amazon']
    for keyword in suspicious_keywords:
        if keyword in path.lower():
            patterns.append(SuspiciousPattern(pattern=f"Suspicious keyword: {keyword}", description=f"URL contains potentially phishing-related keyword: {keyword}", severity=4))
    if 'xn--' in domain:
        patterns.append(SuspiciousPattern(pattern="Punycode domain", description="Domain contains non-Latin characters (internationalized domain)", severity=6))
    if len(domain) > 50:
        patterns.append(SuspiciousPattern(pattern="Extremely long domain", description=f"Domain name is unusually long ({len(domain)} characters)", severity=5))
    return patterns

def calculate_trust_score(is_accessible: bool, has_ssl: bool, ssl_valid: bool, domain_age_days: Optional[int], patterns: List[SuspiciousPattern]) -> int:
    score = 100
    if not is_accessible:
        score -= 25
    if not has_ssl:
        score -= 20
    elif not ssl_valid:
        score -= 10
    if domain_age_days is not None:
        if domain_age_days > 365:
            score += 15
        elif domain_age_days > 30:
            score += 8
        elif domain_age_days < 7:
            score -= 15
    else:
        score -= 8
    total_severity = sum(pattern.severity for pattern in patterns)
    score -= min(total_severity * 1.5, 40)
    return int(max(0, min(100, score)))

def generate_analysis_summary(result: URLAnalysisResult) -> str:
    summary_parts = []
    if result.trust_score >= 80:
        summary_parts.append("✅ This website appears to be legitimate and trustworthy.")
    elif result.trust_score >= 60:
        summary_parts.append("✅ This website appears to be legitimate with minor concerns.")
    elif result.trust_score >= 40:
        summary_parts.append("⚠️ This website has some concerning indicators but may be legitimate.")
    else:
        summary_parts.append("🚨 This website has multiple red flags and should be approached with caution.")
    if result.is_accessible:
        summary_parts.append("• The website is accessible and responds to requests.")
    else:
        summary_parts.append("• ⚠️ The website is not accessible or not responding.")
    if result.has_ssl and result.ssl_valid:
        summary_parts.append("• ✅ Uses a valid SSL certificate for secure connections.")
    elif result.has_ssl:
        summary_parts.append("• ⚠️ Has SSL but certificate may have issues.")
    else:
        summary_parts.append("• ❌ No SSL certificate - connections are not secure.")
    if result.domain_age_days:
        if result.domain_age_days > 365:
            years = result.domain_age_days // 365
            summary_parts.append(f"• ✅ Domain is well-established ({years} year{'s' if years > 1 else ''} old).")
        elif result.domain_age_days > 30:
            months = result.domain_age_days // 30
            summary_parts.append(f"• Domain is {months} month{'s' if months > 1 else ''} old.")
        else:
            summary_parts.append(f"• ⚠️ Domain is very new ({result.domain_age_days} days old).")
    if result.suspicious_patterns:
        summary_parts.append(f"• 🚨 Found {len(result.suspicious_patterns)} suspicious pattern{'s' if len(result.suspicious_patterns) > 1 else ''}:")
        for pattern in result.suspicious_patterns[:3]:
            summary_parts.append(f"  - {pattern.description}")
    return " ".join(summary_parts)

@api_router.get("/")
async def root():
    return {"message": "AI-Enhanced Website Legitimacy Analyzer API"}

@api_router.post("/analyze", response_model=URLAnalysisResult)
async def analyze_url(request: URLAnalysisRequest):
    try:
        normalized_url = normalize_url(request.url)
        parsed_url = urlparse(normalized_url)
        domain = parsed_url.hostname
        if not domain:
            raise HTTPException(status_code=400, detail="Invalid URL format")
        has_ssl, ssl_valid = check_ssl_certificate(normalized_url)
        is_accessible = check_accessibility(normalized_url)
        domain_age_days = get_domain_age(domain)
        suspicious_patterns = detect_suspicious_patterns(normalized_url)
        trust_score = calculate_trust_score(is_accessible, has_ssl, ssl_valid, domain_age_days, suspicious_patterns)
        result = URLAnalysisResult(
            url=normalized_url,
            trust_score=trust_score,
            is_legitimate=trust_score >= 60,
            is_accessible=is_accessible,
            has_ssl=has_ssl,
            ssl_valid=ssl_valid,
            domain_age_days=domain_age_days,
            suspicious_patterns=suspicious_patterns,
            analysis_summary=""
        )
        result.analysis_summary = generate_analysis_summary(result)
        if mongo_available and db is not None:
            try:
                await db.url_analyses.insert_one(result.dict())
            except Exception as e:
                print(f"Failed to store in database: {e}")
        return result
    except Exception as e:
        logging.error(f"Error analyzing URL {request.url}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@api_router.get("/recent", response_model=List[URLAnalysisResult])
async def get_recent_analyses():
    if not mongo_available or db is None:
        return []
    try:
        analyses = await db.url_analyses.find().sort("timestamp", -1).limit(10).to_list(10)
        return [URLAnalysisResult(**analysis) for analysis in analyses]
    except Exception as e:
        print(f"Failed to fetch recent analyses: {e}")
        return []

@api_router.get("/stats")
async def get_statistics():
    if not mongo_available or db is None:
        return {
            "total_analyses": 0,
            "trust_score_distribution": [],
            "cache_hit_rate": "N/A"
        }
    try:
        total_analyses = await db.url_analyses.count_documents({})
        pipeline = [
            {
                "$bucket": {
                    "groupBy": "$trust_score",
                    "boundaries": [0, 20, 40, 60, 80, 100],
                    "default": "other",
                    "output": {"count": {"$sum": 1}}
                }
            }
        ]
        trust_distribution = await db.url_analyses.aggregate(pipeline).to_list(10)
        return {
            "total_analyses": total_analyses,
            "trust_score_distribution": trust_distribution,
            "cache_hit_rate": "N/A"
        }
    except Exception as e:
        print(f"Failed to fetch statistics: {e}")
        return {
            "total_analyses": 0,
            "trust_score_distribution": [],
            "cache_hit_rate": "N/A"
        }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
