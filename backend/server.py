from flask import Flask, request, jsonify
from flask_cors import CORS
import requests, ssl, socket, re, whois
from urllib.parse import urlparse
from datetime import datetime

app = Flask(__name__)
CORS(app)

def normalize_url(url):
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url

def check_website_accessibility(url):
    try:
        response = requests.get(url, timeout=5)
        return True, response.status_code
    except:
        try:
            response = requests.get(url.replace("https://", "http://"), timeout=5)
            return True, response.status_code
        except:
            return False, 0

def check_ssl_certificate(url):
    try:
        parsed = urlparse(url)
        hostname = parsed.hostname
        port = parsed.port or (443 if parsed.scheme == 'https' else 80)
        if parsed.scheme != 'https':
            return False
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port), timeout=10) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                return ssock.getpeercert() is not None
    except:
        return False

def get_domain_age(url):
    try:
        domain = urlparse(url).netloc.replace("www.", "")
        info = whois.whois(domain)
        creation = info.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        return (datetime.now() - creation).days if creation else None
    except:
        return None

def check_suspicious_patterns(url):
    signs = []
    domain = urlparse(url).netloc.lower()

    if any(domain.endswith(tld) for tld in ['.tk', '.ml', '.ga', '.cf', '.click', '.loan']):
        signs.append("Uses suspicious TLD")

    if len(domain.split('.')) > 4:
        signs.append("Too many subdomains")

    if re.search(r'[0-9]{1,3}(\.[0-9]{1,3}){3}', domain):
        signs.append("IP address-like pattern")

    if any(short in domain for short in ['bit.ly', 'tinyurl.com', 't.co']):
        signs.append("Uses URL shortener")

    if re.search(r'[а-я]', domain):
        signs.append("Contains non-Latin characters")

    return signs

def calculate_trust_score(checks, patterns):
    score = 50
    if checks['is_accessible']: score += 20
    else: score -= 30

    if checks['has_ssl']: score += 20
    else: score -= 15

    age = checks['domain_age']
    if age:
        if age > 730: score += 15
        elif age > 365: score += 10
        elif age > 30: score += 5
        else: score -= 10

    score -= len(patterns) * 5
    return max(0, min(100, score))

@app.route("/check", methods=["POST"])
def check():
    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({"error": "URL is required"}), 400

    url = normalize_url(data["url"].strip())
    is_accessible, status_code = check_website_accessibility(url)
    has_ssl = check_ssl_certificate(url)
    domain_age = get_domain_age(url)
    patterns = check_suspicious_patterns(url)

    checks = {
        "is_accessible": is_accessible,
        "status_code": status_code,
        "has_ssl": has_ssl,
        "domain_age": domain_age
    }

    score = calculate_trust_score(checks, patterns)
    is_legit = score >= 60

    reasons = []
    reasons.append("Accessible" if is_accessible else "Not accessible")
    reasons.append("Valid SSL" if has_ssl else "No valid SSL")
    if domain_age is not None:
        reasons.append(f"Domain age: {domain_age} days")
    for p in patterns:
        reasons.append("Warning: " + p)
    if score >= 80:
        reasons.append("High trust")
    elif score >= 60:
        reasons.append("Moderate trust")
    else:
        reasons.append("Low trust")

    return jsonify({
        "url": url,
        "is_legitimate": is_legit,
        "trust_score": score,
        "checks": checks,
        "reasons": reasons,
        "checked_at": datetime.now().isoformat()
    })

if __name__ == "__main__":
    app.run(debug=True)
