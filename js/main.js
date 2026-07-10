
    $(function(){

        /* ===== 모바일 햄버거 서랍 메뉴 ===== */
        function closeMenu(){                        // 서랍 닫기 (공통)
            $(".site-nav, .nav-backdrop").removeClass("open");
            $(".hamburger").text("☰");
        }
        $(".hamburger").on("click", function(){
            const willOpen = !$(".site-nav").hasClass("open");
            $(".site-nav, .nav-backdrop").toggleClass("open", willOpen);  // 서랍+배경 함께
            $(this).text(willOpen ? "✕" : "☰");                          // ☰ ↔ ✕
        });
        $(".nav-backdrop").on("click", closeMenu);   // 배경 누르면 닫힘
        $(".site-nav a").on("click", closeMenu);     // 메뉴 누르면 닫힘

        /* ===== 룸 캐러셀 ===== */
        let idx = 0;                           // 현재 카드 번호
        const total = $(".room-card").length;  // 카드 개수 (자동 계산)

        function stopMusic(){   // 모든 LP 음악 끄고 회전도 멈춤
            $(".LP audio").each(function(){ this.pause(); this.currentTime = 0; });
            $(".LP img").removeClass("playing");
        }

        function update(){
            stopMusic();   // 슬라이드가 움직일 때마다 음악 끔
            const step = $(".room-card").outerWidth(true);   // 카드 너비 + margin
            $(".room-track").css("transform", "translateX(" + (-idx * step) + "px)");
            $(".room-card").removeClass("active").eq(idx).addClass("active");
        }
        /* ===== 자동 슬라이드 ===== */
let timer = null;
let stopped = false;   // ← 추가: 터치로 멈춘 상태인지 기억

function startAuto(){
    stopped = false;   // ← 추가: 재시작할 땐 플래그도 초기화
    timer = setInterval(function(){
       idx = (idx + 1) % total;
        update();
    }, 2000);
}

function stopAuto(){
    clearInterval(timer);
    stopped = true;    // ← 추가: 멈췄음을 기록
}

// hover는 실제 마우스가 있는 기기(데스크톱)에서만 — 모바일 터치와 충돌 방지
if(window.matchMedia("(hover: hover)").matches){
    $(".rocard-inner, .room-card:first-child video, .rocard > button").hover(stopAuto, startAuto);   // 체크인 버튼도 포함 (PC hover)
}

startAuto();   // 페이지 로드 시 자동 시작

        // 다음 / 이전 (끝에서 처음으로 순환)
        $(".next").click(function(){ idx = (idx + 1) % total;         update(); });
        $(".prev").click(function(){ idx = (idx - 1 + total) % total; update(); });

        // 활성 카드 클릭: 1번째는 슬라이드 멈춤, 2번째부터 다음 카드
$(".room-track").on("click", ".room-card.active", function(){
    if(!stopped){
        stopAuto();                    // 1번째 터치: 자동 슬라이드만 멈춤
    } else {
        idx = (idx + 1) % total;       // 2번째 터치부터: 다음 카드
        update();
    }
});

        // 카드 안의 버튼 클릭은 슬라이드로 번지지 않게 + 자동 슬라이드도 멈춤 (모바일 대응)
        $(".room-card button").on("click", function(e){
            e.stopPropagation();
            stopAuto();
        });

        // 창 크기가 바뀌면 위치 다시 계산
        $(window).on("resize", update);

        update();   // 처음 로드 시 첫 카드를 active로

        /* ===== "가운데 보기" 버튼 ===== */
        $(".focus-btn").click(function(){
            document.querySelector(".rooms").scrollIntoView({
                behavior: "smooth",   // 부드럽게 스크롤
                block: "center"       // 세로 화면 중앙에 맞춤
            });
        });

        /* ===== LP 클릭: 회전 + 음악 토글 ===== */
        let toastTimer;   // 토스트 타이머 ID 저장용

        $(".LP img").on("click", function(e){
            e.stopPropagation();
            const audio = $(this).siblings("audio")[0];
            $(this).toggleClass("playing");           // 회전 켜기/ 끄기
            if($(this).hasClass("playing")){
                audio.play();                         // 재생

                // 곡 제목 토스트 띄우기
                const title = $(this).siblings("audio").attr("src").split("/").pop().replace(".mp3", "");
               $(".music-toast").text("♪ " + title).addClass("show");
                clearTimeout(toastTimer);
                toastTimer = setTimeout(function(){
                    $(".music-toast").removeClass("show");
                }, 2000);   // 2초 뒤 사라짐
            } else {
                audio.pause();                        // 멈춤
                audio.currentTime = 0;                // 처음으로 되감기
            }
        });

        /* ===== LP 호버: 미리듣기 ===== */
        $(".LP img").on("mouseenter", function(){
            const audio = $(this).siblings("audio")[0];
            audio.play().catch(function(){});   // 첫 클릭 전엔 브라우저가 거부 → 에러 무시
        }).on("mouseleave", function(){
            if($(this).hasClass("playing")) return;   // 클릭 재생 중이면 호버 아웃해도 안 끔
            const audio = $(this).siblings("audio")[0];
            audio.pause();
            audio.currentTime = 0;
        });

        /* ===== TOP 버튼: 스크롤 내리면 등장, 클릭 시 맨 위로 ===== */
        $(window).on("scroll", function(){
            $(".top-btn").toggleClass("show", $(this).scrollTop() > 300);   // 300px 넘게 내리면 나타남
        });
        $(".top-btn").on("click", function(){
            $("html, body").animate({ scrollTop: 0 }, 500);   // 0.5초 동안 부드럽게 맨 위로
        });

    });
