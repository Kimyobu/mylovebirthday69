/* ============================================================
   Birthday App - Configuration File (config.js)
   รวมข้อความ รูปภาพ และรหัสผ่าน ไว้ที่นี่เพื่อความสะดวกในการแก้ไข
   ============================================================ */

const CONFIG = {
    // ---- Slide 1: Welcome Slide ----
    slide1: {
        title: "สวัสดีค้าบคนสวย",
        subtitle: "เค้ามีของขวัญพิเศษอะไรจะให้หนูด้วยแหละค้าบ",
        btnText: "เปิดดูสิ",
        image: "assets/imgs/kittyNheart.png"
    },

    // ---- Slide 2: Passcode Game ----
    slide2: {
        passcode: "251268", // รหัสผ่าน 6 หลัก (ตรงกับตัวเลขแต่ละหมุน)
        lockTitle: "Hint: Day one of us? (B.E.)",
        successAlert: {
            title: "ถูกต้องแล้วน้ะค้าบบ!",
            text: "ไปดูของขวัญกันเลยยย",
            confirmBtn: "เปิดดูของขวัญ"
        },
        welcomeLockAlrt: {
            title: "ดูเหมือนว่ามันจะถูกล็อกอยู่น้าา",
            text: "ไหนลองเข้าไปปลดล็อกดูสิคับ",
            confirmBtn: "GO GO"
        }
    },

    // ---- Slide 3: Surprise Box, Cake & Note ----
    slide3: {
        clickHint: "คลิกเปิดเลย! 🎁",
        noteBtnText: "💌 อ่านจดหมาย",
        cakeTextTitle: "Happy Birthday! 🎂",
        cakeTextSubtitle: "สุขสันต์วันเกิดนะค้าบคนสวย 💖",

        // SweetAlert2 Modal สำหรับจดหมาย
        noteModal: {
            title: "💌 จดหมายถึงคนสวย",
            htmlContent: `
                <div style="
                    font-family: 'Itim', cursive;
                    font-size: 1.1rem;
                    line-height: 1.85;
                    color: #5c3349;
                    text-align: left;
                    padding: 8px 4px;
                ">
                    <p>สวัสดีค้าบคนสวย 🌸</p>
                    <p>
                        อยากบอกว่าแค่มีหนูเข้ามาในชีวิตของเค้า<br>
                        ก็ทำให้ทุกวันของเค้านั้นพิเศษขึ้นมากๆเลยย
                    </p>
                    <p>
                        ขอให้วันเกิดปีนี้ ของหนูอิม<br>
                        มีแต่ความสุข เต็มไปด้วยรอยยิ้ม<br>
                        และสิ่งดีๆ เข้ามาเต็มๆ เลยน้า<br>
                        รวมถึง เงินทองไหลๆมาเทมาเย้อๆๆ
                    </p>
                    <p>
                        หนูรู้ไหม ว่าเค้าคิดถึงหนูมาก คนสวยของเค้า<br>
                        หนูเป็นเจ้าหญิง เป็นคนที่ทำให้เค้าได้เป็นเจ้าชาย<br>
                        ได้กลายเป็นคนที่ดีขึ้นน เค้ารักหนูมากๆ<br>
                    </p>
                    <p style="margin-top: 16px;">
                        จาก แฟนของหนู
                        เสร็จแล้วเปิดดูของขวัญได้เลยครับ
                    </p>
                </div>
            `,
            confirmBtn: "ไปเปิดของขวัญเยย"
        }
    }
};
