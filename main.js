// MQTT Broker bağlantı bilgileri
const mqttBroker = "ws://192.168.2.180:9001";
const mqttOptions = {
    clientId: "webClient_" + Math.random().toString(16).substr(2, 8),
    username: "",
    password: ""
};

let mqttClient;

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeGraph();
    updateLastUpdateTime();
    setInterval(updateLastUpdateTime, 1000);
    connectMQTT();
});

// Sekme geçişlerini yönetecek fonksiyon
function initializeTabs() {
    const tabs = document.querySelectorAll('nav a');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').slice(1);
            switchTab(targetId);
        });
    });

    // URL'deki hash'e göre sekme aç
    const hash = window.location.hash.slice(1) || 'dashboard';
    switchTab(hash);
}

// Sekme geçişi yapan fonksiyon
function switchTab(tabId) {
    const tabs = document.querySelectorAll('nav a');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        if (tab.getAttribute('href') === `#${tabId}`) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    contents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    window.location.hash = tabId;
}

// Sensör verilerini güncelleyecek fonksiyon
function updateSensorData(x, y, z) {
    document.getElementById('x-value').textContent = x.toFixed(2);
    document.getElementById('y-value').textContent = y.toFixed(2);
    document.getElementById('z-value').textContent = z.toFixed(2);
    updateLastUpdateTime();
    updateGraph(x, y, z);
}

// Saat ve son güncelleme zamanını güncelleyen fonksiyon
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('last-update').textContent = timeString;
    document.getElementById('current-time').textContent = timeString;
}

// Sensör durumunu güncelle - backend bağlandığında çağrılacak
function updateSensorStatus(isConnected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('#sensor-status span:last-child');
    
    if (isConnected) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.textContent = 'Bağlı';
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
        statusText.textContent = 'Bağlı Değil';
    }
}

// Grafik başlatma fonksiyonu
function initializeGraph() {
    const graphElement = document.getElementById('sensor-graph');
    if (graphElement) {
        graphElement.innerHTML = `
            <i class="fas fa-chart-line" style="font-size: 3rem; opacity: 0.5;"></i>
            <p>Sensör bağlantısı bekleniyor...</p>
            <p style="font-size: 0.875rem; opacity: 0.7;">Arduino bağlantısı kurulduğunda grafik otomatik olarak görüntülenecektir.</p>
        `;
    }
}

// Grafik güncelleme fonksiyonu (Arduino bağlantısı sonrası implement edilecek)
function updateGraph(x, y, z) {
    // Grafik kütüphanesi bağlantısı sonrası implement edilecek
}

// Tahmini şiddeti güncelleyecek fonksiyon
function updateMagnitude(value) {
    document.getElementById('magnitude-value').textContent = value.toFixed(1);
}

// Yeni uyarı ekleyecek fonksiyon
function addAlert(message, type = 'warning') {
    const alertList = document.getElementById('alert-list');
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    alertList.insertBefore(alertElement, alertList.firstChild);
    
    if (alertList.children.length > 10) {
        alertList.removeChild(alertList.lastChild);
    }
}

// Sensör durumunu güncelleyecek fonksiyon
function updateSensorStatus(isConnected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('sensor-status');
    
    if (isConnected) {
        statusDot.style.backgroundColor = 'var(--success-color)';
        statusText.textContent = 'Bağlı';
    } else {
        statusDot.style.backgroundColor = 'var(--danger-color)';
        statusText.textContent = 'Bağlantı Kesildi';
    }
}

// Ayarları kaydeden fonksiyon
function saveSettings() {
    const settings = {
        thresholdLow: parseFloat(document.getElementById('threshold-low').value),
        thresholdHigh: parseFloat(document.getElementById('threshold-high').value),
        samplingRate: parseInt(document.getElementById('sampling-rate').value)
    };
    // Arduino bağlantısı sonrası ayarlar gönderilecek
    console.log('Ayarlar kaydedildi:', settings);
}

// MQTT bağlantısını kuran fonksiyon
function connectMQTT() {
    console.log("MQTT Broker'a bağlanılıyor...");
    try {
        mqttClient = mqtt.connect(mqttBroker, mqttOptions);

        mqttClient.on('connect', () => {
            console.log("MQTT Broker'a bağlandı!");
            updateSensorStatus(true);
            mqttClient.subscribe('kurumsal/veri');
        });

        mqttClient.on('message', (topic, message) => {
            if (topic === 'kurumsal/veri') {
                // Sahte ivme verileri oluştur (gerçek veriler gelene kadar)
                const x = (Math.random() - 0.5) * 2; // -1 ile 1 arası
                const y = (Math.random() - 0.5) * 2;
                const z = (Math.random() - 0.5) * 2;
                
                // Verileri güncelle
                updateSensorData(x, y, z);
                
                // Tahmini şiddeti hesapla (basit bir formül)
                const magnitude = Math.sqrt(x*x + y*y + z*z);
                updateMagnitude(magnitude);
                
                // Eğer belirli bir eşiği geçerse uyarı ekle
                if (magnitude > 1.5) {
                    addAlert(`Yüksek hareket tespit edildi! Şiddet: ${magnitude.toFixed(2)}`, 'warning');
                }
            }
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT Bağlantı hatası:', error);
            updateSensorStatus(false);
        });

        mqttClient.on('close', () => {
            console.log('MQTT Bağlantısı kapandı');
            updateSensorStatus(false);
        });

    } catch (error) {
        console.error('MQTT Bağlantı hatası:', error);
        updateSensorStatus(false);
    }
}
