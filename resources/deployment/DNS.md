# 🚀 **DNS (Domain Name System) – Full In-Depth Explanation**

DNS is often called the **“phonebook of the internet.”**
It translates human-friendly domain names like:

```
google.com
youtube.com
thecodedsa.com
```

into machine-friendly IP addresses like:

```
142.250.193.206 (IPv4)
2404:6800:4004:80b::200e (IPv6)
```

Computers only understand IPs, not names → DNS resolves this.

---

# 🧠 **Why DNS Exists?**

* Humans remember domain names easily.
* Browsers, servers, routers work with **IP addresses**.
* DNS maps **Name → IP** through a global, distributed database.

---

# 🌍 **DNS Architecture (High-Level)**

DNS is **hierarchical**; think of it like a tree.

```
                        Root (.)
                          |
          +---------------+---------------+
          |               |               |
        .com             .net           .org   (Top-Level Domains)
          |
      google.com (Second-level domain)
          |
  www.google.com (Subdomain)
```

---

# 🔎 **How DNS Resolution Works (Step-by-Step)**

When you type **google.com** in a browser:

### **1. Browser Cache**

Browser checks if it already knows the IP.

If not…

### **2. OS Cache**

Your computer has a DNS cache (`ipconfig /displaydns` on Windows).

If not…

### **3. Local DNS Resolver (ISP or custom DNS like 8.8.8.8)**

Your system sends a DNS query to your resolver, often:

* Your ISP's DNS
* Google DNS `8.8.8.8`
* Cloudflare DNS `1.1.1.1`

If not…

### **4. Root DNS Servers**

There are 13 root server clusters worldwide.

They do NOT know exact IPs.
They only point you to TLD servers.

**Example:** For `google.com`, root says:

> “the `.com` TLD server is at xyz IP”

### **5. TLD (Top-Level Domain) Servers**

`.com`, `.net`, `.org`, `.in` TLDs exist.

They do NOT know full IP either.
They point to **Authoritative DNS servers** for the domain.

TLD response:

> “google.com DNS is managed by ns1.google.com”

### **6. Authoritative DNS Server**

This is the final authority.

It has actual DNS records like:

* A Record → IP address
* CNAME → alias
* MX → mail server

This server gives the final answer:

> google.com → 142.250.193.206

### **7. Resolver Caches**

Resolver caches the result for TTL.

### **8. Browser connects to the IP**

Browser now sends HTTP/HTTPS request to that IP.

---

# 🧩 **Visual Flow (Text Diagram)**

```
Browser → Browser Cache
          ↓ (if miss)
        OS Cache
          ↓ (if miss)
    DNS Resolver (8.8.8.8)
          ↓
      Root Servers
          ↓
        TLD Servers (.com)
          ↓
  Authoritative DNS (Google)
          ↓
      Returns IP Address
```

---

# 🔥 **Types of DNS Records (Most Important)**

### **1. A Record (Address Record)**

Maps domain → IPv4

```
google.com → 142.250.193.206
```

### **2. AAAA Record**

Maps domain → IPv6

```
google.com → 2404:6800:4004:80b::200e
```

### **3. CNAME (Alias)**

Points one domain to another.

```
www.example.com → example.com
```

### **4. MX (Mail Exchange)**

Specifies servers that receive emails.

```
example.com → mail.google.com
```

### **5. TXT Record**

Stores arbitrary text. Mostly used for:

* SPF (email anti-spam)
* Google site verification
* DKIM, DMARC

Example:

```
v=spf1 include:_spf.google.com ~all
```

### **6. NS (Name Server Record)**

Specifies authoritative DNS servers.

```
ns1.exampledns.com
ns2.exampledns.com
```

### **7. SOA (Start of Authority)**

Contains metadata about the domain:

* primary NS
* admin email
* serial number
* refresh, retry intervals

---

# ⚡ **Recursive vs Iterative DNS Queries**

### **Recursive Query**

Resolver handles everything for you.

Browser → Resolver
Resolver → Root → TLD → Authoritative

Your machine gets final answer.

### **Iterative Query**

Resolver asks each server one-by-one.

Resolver → Root → "go to .com"
Resolver → .com → "go to google"
Resolver → Google → IP

---

# 🕒 **DNS TTL (Time To Live)**

TTL = how long DNS results are cached.

Example:

```
TTL: 3600 seconds (1 hour)
```

If TTL = 1 hour:

* Next 1 hour = no DNS lookup
* Faster performance
* Less DNS traffic

If you want **fast propagation** (during domain migration):
Set **low TTL**, like:

```
TTL = 60 seconds
```

---

# 🏎️ **DNS Propagation**

When you update DNS records:

* It takes time to update globally
* Because DNS servers cache data using TTL

Propagation usually:

* Fast DNS providers → 5 min to 1 hour
* Older ISPs → 24–48 hours

---

# 🔐 **DNS Security Concepts**

### **1. DNSSEC**

Adds digital signatures to avoid:

* DNS spoofing
* Cache poisoning

### **2. DNS Spoofing / Cache Poisoning**

Attacker changes DNS answers → redirects users to a fake website.

### **3. DoH & DoT**

Encrypt DNS queries:

* DoH → DNS over HTTPS
* DoT → DNS over TLS

Prevents:

* ISP snooping
* MITM attacks

---

# 📡 **Types of DNS Servers**

### **1. Root Name Servers**

Top of DNS hierarchy.

### **2. TLD Servers**

Handle .com, .net, .org, .in, .dev etc.

### **3. Authoritative Name Servers**

Store your domain’s DNS records.

Example providers:

* Cloudflare
* GoDaddy
* AWS Route53
* Netlify DNS
* Namecheap

### **4. Recursive Resolvers**

Usually your ISP or public DNS like:

* Google DNS 8.8.8.8
* Cloudflare DNS 1.1.1.1
* OpenDNS

---

# 🌐 **Real Example: Resolving thecodedsa.com**

1. Browser checks cache
2. OS checks cache
3. Resolver (1.1.1.1) queried
4. Root server → TLD `.com`
5. `.com` server → Cloudflare (NS)
6. Cloudflare DNS → gives A record
7. Browser connects to IP

---

# 💡 **Important: DNS vs Hosting**

* DNS = maps domain to IP.
* Hosting = server that stores website code.

If you change hosting:

* Update the A record → new IP.

If you change DNS provider:

* You update the NS records.

---

# 🎯 **Summary (Super Quick)**

| Concept           | Meaning                   |
| ----------------- | ------------------------- |
| DNS               | Converts domain to IP     |
| A Record          | Domain → IPv4             |
| CNAME             | Domain → Domain           |
| MX                | Email servers             |
| NS                | Name server               |
| TTL               | Cache duration            |
| DNSSEC            | Security for DNS          |
| DoH/DoT           | Encrypted DNS             |
| Recursive query   | Resolver finds everything |
| Authoritative DNS | Final answer for domain   |

---
