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

    // Element สำหรับปุ่มกลับไปหน้าเริ่มต้น (ไอคอนลูกศร)
    const backButtonContainer = document.getElementById('back-button-container'); // เลือก container ของปุ่ม
    const backToStartIcon = document.getElementById('backToStartIcon'); // เลือกตัวไอคอนเอง (เผื่อต้องการสไตล์เฉพาะ)

    // รายการวิดีโอแปรงฟันของคุณ (ใส่ path relative)
    const videoList = [
        'Videos/brushing_1.mp4',
        'Videos/brushing_2.mp4',
        'Videos/brushing_3.mp4',
        // เพิ่มวิดีโออื่นๆ ที่นี่ ตามลำดับการแปรงแต่ละด้าน
    ];

    let currentVideoIndex = 0;
    const CHANGE_SIDE_DISPLAY_TIME = 2000; // แสดงหน้า "เปลี่ยนด้าน" 2 วินาที
    let countdownIntervalId; // สำหรับเก็บ ID ของ setInterval ของ countdown
    let videoTimerId; // สำหรับเก็บ ID ของ setTimeout ของ video (ถ้ามี)

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
        if (videoTimerId) clearTimeout(videoTimerId);

        // หยุดวิดีโอและรีเซ็ตตำแหน่ง
        brushingVideo.pause();
        brushingVideo.currentTime = 0;
        videoProgress.value = 0; // รีเซ็ต Progress Bar

        currentVideoIndex = 0; // รีเซ็ตดัชนีวิดีโอ

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
        if (currentVideoIndex < videoList.length) {
            brushingVideo.src = videoList[currentVideoIndex];
            brushingVideo.load();

            // ตั้งค่า max ของ Progress Bar เป็นความยาวของวิดีโอปัจจุบัน
            // ต้องรอให้ metadata โหลดเสร็จก่อน
            brushingVideo.onloadedmetadata = () => {
                videoProgress.max = brushingVideo.duration;
            };

            // อัปเดต Progress Bar ขณะวิดีโอกำลังเล่น
            brushingVideo.ontimeupdate = () => {
                videoProgress.value = brushingVideo.currentTime;
            };

            // Event Listener เมื่อวิดีโอเล่นจบ
            brushingVideo.onended = () => {
                // รีเซ็ต Progress Bar เมื่อจบวิดีโอ
                videoProgress.value = 0;

                // ถ้าไม่ใช่คลิปสุดท้าย ให้แสดงหน้า "เปลี่ยนด้าน"
                if (currentVideoIndex < videoList.length - 1) {
                    showScreen('change-side-screen');
                    videoTimerId = setTimeout(() => { // เก็บ ID ของ Timeout
                        currentVideoIndex++; // ไปยังวิดีโอถัดไป
                        showScreen('brushing-screen'); // กลับไปหน้าวิดีโอ
                        startBrushingProcess(); // เล่นวิดีโอถัดไป
                    }, CHANGE_SIDE_DISPLAY_TIME); // แสดงหน้าเปลี่ยนด้านตามเวลาที่กำหนด
                } else {
                    // ถ้าเป็นคลิปสุดท้ายแล้ว ให้แสดงหน้าจบ
                    showScreen('end-screen');
                    // หยุดวิดีโอและรีเซ็ตตำแหน่งเล่น
                    brushingVideo.pause();
                    brushingVideo.currentTime = 0;
                }
            };

            // พยายามเล่นวิดีโอ
            brushingVideo.play().catch(error => {
                console.error("Video autoplay failed:", error);
            });

        } else {
            // กรณีที่ไม่มีวิดีโอให้เล่นแล้ว
            showScreen('end-screen');
            brushingVideo.pause();
            brushingVideo.currentTime = 0;
        }
    }

    // --- เริ่มต้นที่หน้า Start เสมอเมื่อโหลดหน้าเว็บ ---
    showScreen('start-screen');
});