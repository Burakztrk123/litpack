// MQTT Broker bağlantı bilgileri
// MQTT Broker bağlantı bilgileri - her zaman WS kullan
const mqttBroker = 'ws://78.189.91.27:9001';  // MQTT broker adresi

const mqttOptions = {
    clientId: `webClient_${Math.random().toString(16).substr(2, 8)}`,
    username: "",
    password: "",
    keepalive: 10,            // Daha sık bağlantı kontrolü
    reconnectPeriod: 1000,    // Daha hızlı yeniden bağlanma
    connectTimeout: 5000,     // Daha kısa timeout
    clean: true,
    resubscribe: true,
    qos: 0,
    rejectUnauthorized: false // SSL sertifika hatasını yoksay
};

let mqttClient;

// Global değişkenler
let clockInterval;

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeGraph();
    startClock(); // Saati başlat
    setInterval(checkSensorConnection, 1000); // Her saniye sensör bağlantısını kontrol et
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

    // Tahmini şiddet hesaplama ve güncelleme
    const magnitude = Math.sqrt(x*x + y*y + z*z);
    updateMagnitude(magnitude);

    // Grafik güncelleme
    updateGraph(x, y, z);
}

// Saat fonksiyonları
function startClock() {
    // Varolan interval'i temizle
    if (clockInterval) {
        clearInterval(clockInterval);
    }

    // Saati hemen güncelle
    updateClock();

    // Her saniye güncellenecek şekilde ayarla
    clockInterval = setInterval(updateClock, 1000);
}

function updateClock() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
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

// Hareket analizi verilerini güncelleyecek fonksiyon
function updateMagnitude(value) {
    const magnitudeElement = document.getElementById('magnitude-value');
    const analysisStatus = document.getElementById('analysis-status');

    if (magnitudeElement && analysisStatus) {
        // Şiddet değeri güncelleme
        magnitudeElement.textContent = value.toFixed(1);

        // Durum güncelleme
        analysisStatus.className = ''; // Tüm sınıfları temizle

        if (value >= 5.0) {
            analysisStatus.textContent = 'Şiddetli';
            analysisStatus.classList.add('status-danger');
        } else if (value >= 3.0) {
            analysisStatus.textContent = 'Orta';
            analysisStatus.classList.add('status-warning');
        } else {
            analysisStatus.textContent = 'Normal';
            analysisStatus.classList.add('status-normal');
        }
    }
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
    const statusText = document.querySelector('#sensor-status span:last-child');
    
    if (isConnected) {
        statusDot.classList.remove('disconnected');
        statusDot.classList.add('connected');
        statusText.textContent = 'Bağlı';
    } else {
        statusDot.classList.remove('connected');
        statusDot.classList.add('disconnected');
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

// Sensör bağlantısını kontrol eden fonksiyon
function checkSensorConnection() {
    if (!lastMessageTime) return; // Henüz hiç veri gelmemişse kontrol etme
    
    const now = Date.now();
    if (now - lastMessageTime > sensorTimeout) {
        if (sensorActive) {
            sensorActive = false;
            updateSensorStatus(false);
            console.log('Sensör bağlantısı koptu!');
        }
    }
}

// MQTT bağlantısını kuran fonksiyon
function connectMQTT() {
    console.log("MQTT Broker'a bağlanılıyor...");
    try {
        if (mqttClient) {
            mqttClient.end(true); // Varolan bağlantıyı temizle
        }
        
        mqttClient = mqtt.connect(mqttBroker, mqttOptions);

        mqttClient.on('connect', () => {
            console.log("MQTT Broker'a bağlandı!");
            mqttClient.subscribe('kurumsal/veri', { qos: 0 });
        });

        mqttClient.on('reconnect', () => {
            console.log('Yeniden bağlanılıyor...');
            updateSensorStatus(false);
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT Hatası:', error);
            updateSensorStatus(false);
        });

        let sensorActive = false;
        let lastMessageTime = 0;
        const sensorTimeout = 2000; // 2 saniye veri gelmezse sensör bağlantısı kopmuş sayılır

        // Debug için bağlantı durumunu konsola yazdır
        console.log('MQTT Bağlantı Durumu:', {
            broker: mqttBroker,
            connected: mqttClient.connected,
            reconnecting: mqttClient.reconnecting
        });

        mqttClient.on('message', (topic, message) => {
            if (topic === 'kurumsal/veri') {
                const now = Date.now();
                lastMessageTime = now;
                console.log('Yeni veri alındı:', message.toString()); // Debug için
                
                if (!sensorActive) {
                    sensorActive = true;
                    updateSensorStatus(true);
                }

                try {
                    const data = JSON.parse(message.toString());
                    if (data.x !== undefined && data.y !== undefined && data.z !== undefined) {
                        // Değerleri yuvarla
                        const x = parseFloat(data.x.toFixed(2));
                        const y = parseFloat(data.y.toFixed(2));
                        const z = parseFloat(data.z.toFixed(2));
                        
                        updateSensorData(x, y, z);
                        const magnitude = Math.sqrt(x * x + y * y + z * z);
                        updateMagnitude(magnitude);
                        
                        if (magnitude > 1.5) {
                            addAlert(`Yüksek hareket tespit edildi! Şiddet: ${magnitude.toFixed(2)}`, 'warning');
                        }
                    }
                } catch (error) {
                    console.error('Veri işleme hatası:', error);
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
