# 🚀 Performance Test Suite (k6)

A lightweight performance testing project using **k6** and **JavaScript** to verify system latency and stability under load.

---

## ⚡ Features demonstrated

* **Load Ramping (Stages):** Simulates users ramping up, maintaining stable load, and ramping down.
* **Performance Gates (Thresholds):** Enforces SLAs on p(95) response times and error rates (fails the test if thresholds are breached).
* **Assertions & Content Verification (Checks):** Performs assertions on HTML response bodies (verifying key text elements and redirect target strings) to ensure functional correctness under load.
* **Tag-based Metrics & SLAs:** Isolates and verifies performance rules (response times and checks success rates) for different pages (e.g., `landing` vs `news`) using custom tag metadata.
* **Custom Metrics (Trends):** Tracks specific target pages (like the News page) using custom metrics.
* **Precondition Verification (setup):** Performs environment checks at startup and aborts the run dynamically if the server is offline.
* **Modular User Journeys:** Grouped and tagged scenarios (Landing Page, static assets, and News Page).
* **CI/CD Pipeline Integration:** Integrated with GitHub Actions to run performance tests and verify thresholds automatically on every commit and pull request.
* **Dual Reporting:** Automatically outputs both a terminal summary (`stdout`) and a graphical HTML report (`summary.html`).

---

## 🧪 How to Run

1. **Install k6:**

   * Windows: `winget install k6`
   * Mac: `brew install k6`
   * Linux: `sudo apt-get install k6`
2. **Run the test:**

   ```bash
   k6 run load-test.js
   ```
   *Note: A graphical report named `summary.html` is automatically created in the root folder, while the standard results table is printed directly to the console.*
