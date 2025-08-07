document.addEventListener('DOMContentLoaded', () => {
    // กำหนด Element ต่างๆ
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const brushingScreen = document.getElementById('brushing-screen');
    const changeSideScreen = document.getElementById('change-side-screen');
    const endScreen = document.getElementById('end-screen');
    
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const countdownDisplay = document.getElementById('countdown-display');
    const brushingVideo = document.getElementById('brushing-video');
    const videoProgress = document.getElementById('video-progress');

    // เพิ่ม Element สำหรับวิดีโอ Warning
    const warningVideo = document.getElementById('warning-video');

    // เพิ่ม Element สำหรับแสดงความคืบหน้า (เช่น 2/17)
    const videoProgressDisplay = document.getElementById('video-progress-display');

    // Element สำหรับปุ่มกลับไปหน้าเริ่มต้น (ไอคอนลูกศร)
    const backButtonContainer = document.getElementById('back-button-container');

        // วิดีโอแปรงฟัน
    const videoList = [
        'brushing_1.mp4',
        'brushing_2.mp4',
        'brushing_3.mp4',
        'brushing_4.mp4',
        'brushing_5.mp4',
        'brushing_6.mp4',
        'brushing_7.mp4',
        'brushing_8.mp4',
        'brushing_9.mp4',
        'brushing_10.mp4',
        'brushing_11.mp4',
        'brushing_12.mp4',
        'brushing_13.mp4',
        'brushing_14.mp4',

    ];

    // วิดีโอ Warning
    const warningVideoList = [
        'warning_1.mp4',
        'warning_2.mp4',
        'warning_3.mp4',
        'warning_4.mp4',
        'warning_5.mp4',
        'warning_6.mp4',
        'warning_7.mp4',
        'warning_8.mp4',
        'warning_9.mp4',
        'warning_10.mp4',
        'warning_11.mp4',
        'warning_12.mp4',
        'warning_13.mp4',
    ];
    const totalVideos = videoList.length; // จำนวนวิดีโอทั้งหมด

    let currentVideoIndex = 0;
    let countdownIntervalId;

    // --- ฟังก์ชันควบคุมหน้าจอ ---
    function showScreen(screenId) {
        // ซ่อนทุกหน้าจอ
        startScreen.classList.add('hidden');
        countdownScreen.classList.add('hidden');
        brushingScreen.classList.add('hidden');
        changeSideScreen.classList.add('hidden');
        endScreen.classList.add('hidden');

        // แสดงหน้าจอที่ระบุ
        document.getElementById(screenId).classList.remove('hidden');

        // แสดง/ซ่อนปุ่ม "กลับไปหน้าเริ่มต้น" ตามหน้าจอ
        if (screenId === 'start-screen') {
            backButtonContainer.classList.add('hidden'); // ซ่อนในหน้าเริ่มต้น
        } else {
            backButtonContainer.classList.remove('hidden'); // แสดงในหน้าอื่นๆ
        }
    }

    // --- ฟังก์ชันรีเซ็ตสถานะและกลับไปหน้าเริ่มต้น ---
    function resetAndGoToStart() {
        // หยุด Timer ที่กำลังทำงานอยู่ทั้งหมด
        if (countdownIntervalId) clearInterval(countdownIntervalId);

        // หยุดวิดีโอและรีเซ็ตตำแหน่ง
        brushingVideo.pause();
        brushingVideo.currentTime = 0;
        videoProgress.value = 0; // รีเซ็ต Progress Bar
        warningVideo.pause(); // หยุดวิดีโอ warning ด้วย
        warningVideo.currentTime = 0;

        currentVideoIndex = 0; // รีเซ็ตดัชนีวิดีโอ
        videoProgressDisplay.textContent = ''; // ล้างข้อความแสดงความคืบหน้า

        showScreen('start-screen'); // กลับไปหน้าเริ่มต้น
    }

    // --- เพิ่ม Event Listener ให้กับปุ่ม "กลับไปหน้าเริ่มต้น" (ไอคอนลูกศร) ---
    backButtonContainer.addEventListener('click', resetAndGoToStart);


    // --- เริ่มต้นกระบวนการ ---
    startButton.addEventListener('click', () => {
        showScreen('countdown-screen');
        startCountdown();
    });

    restartButton.addEventListener('click', () => {
        currentVideoIndex = 0; // รีเซ็ตดัชนีวิดีโอ
        showScreen('countdown-screen');
        startCountdown();
    });

    // --- นับถอยหลัง 3 2 1 ---
    function startCountdown() {
        let count = 3;
        countdownDisplay.textContent = count;

        countdownIntervalId = setInterval(() => { // เก็บ ID ของ Interval
            count--;
            countdownDisplay.textContent = count;
            if (count === 0) {
                clearInterval(countdownIntervalId);
                showScreen('brushing-screen');
                startBrushingProcess(); // เริ่มกระบวนการแปรงฟัน
            }
        }, 1000);
    }

    // --- กระบวนการแปรงฟัน (เล่นวิดีโอและเปลี่ยนด้าน) ---
    function startBrushingProcess() {
        if (currentVideoIndex < totalVideos) { // ใช้ totalVideos แทน videoList.length
            brushingVideo.src = videoList[currentVideoIndex];
            brushingVideo.load();
            
            // อัปเดตข้อความแสดงความคืบหน้า
            videoProgressDisplay.textContent = `${currentVideoIndex + 1}/${totalVideos}`;

            // ตั้งค่า max ของ Progress Bar เป็นความยาวของวิดีโอปัจจุบัน
            brushingVideo.onloadedmetadata = () => {
                videoProgress.max = brushingVideo.duration;
            };

            // อัปเดต Progress Bar ขณะวิดีโอกำลังเล่น
            brushingVideo.ontimeupdate = () => {
                videoProgress.value = brushingVideo.currentTime;
            };

            // Event Listener เมื่อวิดีโอ brushing เล่นจบ
            brushingVideo.onended = () => {
                videoProgress.value = 0; // รีเซ็ต Progress Bar

                // ถ้าไม่ใช่คลิปสุดท้าย ให้แสดงหน้า "เปลี่ยนด้าน" และเล่นวิดีโอ warning
                if (currentVideoIndex < totalVideos - 1) { // ใช้ totalVideos แทน videoList.length
                    // ตรวจสอบว่ามีวิดีโอ warning สำหรับด้านนี้หรือไม่
                    if (warningVideoList[currentVideoIndex]) {
                        showScreen('change-side-screen');
                        warningVideo.src = warningVideoList[currentVideoIndex];
                        warningVideo.load();
                        warningVideo.play().catch(error => {
                            console.error("Warning video autoplay failed:", error);
                        });

                        // เมื่อวิดีโอ warning เล่นจบ ค่อยไปด้านต่อไป
                        warningVideo.onended = () => {
                            currentVideoIndex++; // ไปยังวิดีโอ brushing ถัดไป
                            showScreen('brushing-screen'); // กลับไปหน้าวิดีโอ brushing
                            startBrushingProcess(); // เล่นวิดีโอ brushing ถัดไป
                        };
                    } else {
                        // ถ้าไม่มีวิดีโอ warning สำหรับด้านนี้ ให้ข้ามไป brushing ถัดไปเลย
                        console.warn(`Warning video for index ${currentVideoIndex} not found. Skipping.`);
                        currentVideoIndex++; // ไปยังวิดีโอ brushing ถัดไป
                        showScreen('brushing-screen');
                        startBrushingProcess();
                    }
                } else {
                    // ถ้าเป็นคลิปสุดท้ายแล้ว (brushing_video สุดท้ายจบ) ให้แสดงหน้าจบ
                    showScreen('end-screen');
                    brushingVideo.pause();
                    brushingVideo.currentTime = 0;
                }
            };

            // พยายามเล่นวิดีโอ brushing
            brushingVideo.play().catch(error => {
                console.error("Brushing video autoplay failed:", error);
            });

        } else {
            // กรณีที่ไม่มีวิดีโอ brushing ให้เล่นแล้ว (แต่ควรจะถูกจับโดย currentVideoIndex < totalVideos)
            showScreen('end-screen');
            brushingVideo.pause();
            brushingVideo.currentTime = 0;
        }
    }

    // --- เริ่มต้นที่หน้า Start เสมอเมื่อโหลดหน้าเว็บ ---
    showScreen('start-screen');
});
