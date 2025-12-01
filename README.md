# LLM-QA Security Testing – OWASP Juice Shop (XSS)

Bu repo, **LLM-QA** projesi kapsamında OWASP Juice Shop üzerinde yapılan **XSS güvenlik testi deneyi** için hazırlanmış minimal bir Cypress projesidir.

Amaç:
- GitHub’daki bir yazılım projesi (OWASP Juice Shop) üzerinde
- LLM tabanlı kalite analiz yaklaşımına uygun olarak
- Gerçek bir güvenlik açığını (Reflected XSS) **otomatik bir test ile kanıtlamak**  
ve bu sürecin adımlarını belgelendirmektir.

---

**1. Ne Test Ediliyor?**

Hedef uygulama: **OWASP Juice Shop**

Hedef hata:  
- Arama özelliğinde (`/search?q=`) bulunan **Reflected XSS (Yansıtılmış XSS)** açığı  
- Kullanıcıdan gelen `q` parametresi, yeterli filtreleme yapılmadan DOM içinde çalıştırılabiliyor.

Klasik `alert('XSS')` yaklaşımı yerine, daha stabil bir yöntem kullanıldı:

```
html
<iframe src="javascript:window.parent.hacked=true"></iframe>
Bu payload çalıştığında, tarayıcıdaki window objesinde:

```
js
**window.hacked === true**
oluyor ve Cypress testi de tam olarak bunu doğruluyor.


**2.Gereksinimler**

Bu testin çalışması için:

Node.js (20.x önerilir)

npm

Yerelde çalışan OWASP Juice Shop (varsayılan: http://localhost:3000)

Global veya lokal Cypress kurulumu

Juice Shop için kurulum dokümantasyonu:
https://github.com/juice-shop/juice-shop


**3. Kurulum Adımları (Adım Adım)**

3.1. Juice Shop’u Çalıştır

Önce Juice Shop reposunu ayrı bir klasörde çalıştırmalısın:

git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
npm install
npm start


Terminalde şu mesaja benzer bir şey görmelisin:

Server listening on port 3000



3.2. Bu Repoyu Klonla

Ayrı bir klasörde bu LLM-QA test reposunu çek:

git clone https://github.com/mineekilincc/LLM-QA-SecurityTestingOWASP.git
cd LLM-QA-SecurityTestingOWASP


Ardından minimal bir package.json oluşturup Cypress kur:

npm init -y
npm install cypress --save-dev



3.3. Cypress’i Aç

npx cypress open

Cypress açıldığında:

E2E Testing seç

Bir tarayıcı (Chrome vs.) seç

Spec listesinde xss-juice-shop.cy.js test dosyasını görmelisin.


**4. Testin Çalışma Mantığı**

Test kodu (özet):

/// <reference types="cypress" />

describe('XSS Test – OWASP Juice Shop (Variable Injection)', () => {
  it('should prove XSS by modifying the window object', () => {
    const payload = `<iframe src="javascript:window.parent.hacked=true"></iframe>`;

    cy.visit(`http://localhost:3000/#/search?q=${encodeURIComponent(payload)}`);
  
    cy.window().should('have.property', 'hacked', true);
  });
});


Adımlar:

Juice Shop ana sayfasının arama sayfasına, q parametresiyle bir XSS payload gönderiliyor.

Bu payload, window.parent.hacked = true şeklinde global bir değişken yazıyor.

Cypress, cy.window() ile tarayıcı penceresini alıyor ve hacked isminde bir property olup olmadığını kontrol ediyor.

Eğer test PASS ise → XSS payload’ı gerçekten çalışmış, yani açık var demektir. BURAYI METİN DİZİLİMİ OLARAK GİTHUB README KISMINA UYGUN OLARAK SYANTACKSLER MİSİN
