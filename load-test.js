import http from 'k6/http';
import {sleep, check, group} from 'k6';
import { Trend } from 'k6/metrics';
import exec from 'k6/execution';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export const options = {
    stages: [
        { duration: '3s', target: 5 }, 
        { duration: '5s', target: 5 }, 
        { duration: '3s', target: 0 }, 
    ],
    thresholds: {
        http_req_duration : ['p(95) < 150'],
        'http_req_duration{page: landing}' : ['p(95) < 200'], 
        'http_req_duration{page: news}' : ['p(95) < 150'], 
        group_duration: ['p(95) < 5000'],
        http_req_failed: ['rate < 0.01'],
        checks: ['rate > 0.99'],
        'checks{page: landing}': ['rate > 0.99'], 
        'checks{page: news}': ['rate > 0.99'], 
        news_page_response_time: ['p(95) < 150'], 
    }
}

export function setup() {
    const landingPage = http.get('https://quickpizza.grafana.com/test.k6.io/');
    if (landingPage.error) {
        exec.test.abort(`Setup failed: ${landingPage.error}`);
    }
}

const newsPageResponseTimeTrend = new Trend('news_page_response_time');

export default function(){
    group('Landing Page', function() {
        const landingPageRes = http.get('https://quickpizza.grafana.com/test.k6.io/', { tags: { page: 'landing'}});
        
        check(landingPageRes, {
            'status is 200': (r) => r.status === 200,
            'url redirects to landing page': (r) => r.body.includes('QuickPizza Legacy'),
            'body contains expected content': (r) => r.body.includes('This is a replacement of the service previously found'),
        }, { page: 'landing' });
        
        sleep(2);

        group('Assets', function(){
            const cssAssetsRes = http.get('https://quickpizza.grafana.com/test.k6.io/static/css/site.css', { tags: { page: 'assets'}});
            const imageAssetsRes = http.get('https://quickpizza.grafana.com/test.k6.io/static/favicon.ico', { tags: { page: 'assets'}});
        });
    });

    group('News Page', function() {
        const newsPageRes = http.get('https://quickpizza.grafana.com/news.php', { tags: { page: 'news'}});
        newsPageResponseTimeTrend.add(newsPageRes.timings.duration);
        
        check(newsPageRes, {
            'status is 200': (r) => r.status === 200,
            'body contains expected content': (r) => r.body.includes('In the news'),
        }, { page: 'news' });
        
        sleep(2);
        
        group('News Page Assets', function(){
            const newsCssRes = http.get('https://quickpizza.grafana.com/test.k6.io/static/css/site.css', { tags: { page: 'news_assets'}});
            const newsImageRes = http.get('https://quickpizza.grafana.com/test.k6.io/static/favicon.ico', { tags: { page: 'news_assets'}});
            sleep(2);
        });
    });
}

export function handleSummary(data) {
    return {
        "stdout": textSummary(data, { indent: ' ', enableColors: true }),
        "summary.html": htmlReport(data),
    };
}