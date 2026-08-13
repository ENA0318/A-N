
        $(function(){

    /* ===== 모바일 햄버거 드로어 (header.open 토글) ===== */
    function closeMenu(){
        $("header").removeClass("open");
        $(".hamburger").text("☰");
    }
    $(".hamburger").on("click", function(e){
        e.stopPropagation();
        const willOpen = !$("header").hasClass("open");
        $("header").toggleClass("open", willOpen);
        $(this).text(willOpen ? "✕" : "☰");
    });
    $(".nav-backdrop").on("click", closeMenu);
    $(".gnb a, .util a").on("click", closeMenu);

    /* ===== 엘리베이터: 터치(클릭)로도 열고 닫기 ===== */
    $(".elevator-box").on("click", function(e){
        e.stopPropagation();          // 아래 "바깥 클릭 닫기"로 번지지 않게
        $(this).toggleClass("open");
    });
    $(document).on("click", function(){
        $(".elevator-box").removeClass("open");   // 바깥 아무 데나 누르면 닫힘
    });

    const audio = document.getElementById("bgm");

    /* 일시정지/재생 토글 (음악 + 슬라이드 함께) */
    $(".btn-playpause i").on("click", function(){
        if(audio.paused){
            audio.play();
            $(this).removeClass("fa-play").addClass("fa-pause");
            $(".song-title span").removeClass("paused");   // 슬라이드 다시 재생
            $(".LP img").addClass("playing");
        } else {
            audio.pause();
            $(this).removeClass("fa-pause").addClass("fa-play");
            $(".song-title span").addClass("paused");       // 슬라이드도 같이 멈춤
            $(".LP img").removeClass("playing");
        }
    });

    /* 음소거 토글 */
    $(".btn-volume i").on("click", function(){
        audio.muted = !audio.muted;
        $(this).toggleClass("fa-volume-high fa-volume-xmark");
    });

    /* ===== 인트로 이미지 자동 슬라이드 ===== */
    let slideIdx = 0;                                // 현재 이미지 번호
    const slideTotal = $(".slide-img img").length;   // 이미지 개수 (자동 계산)

    function slideUpdate(){
        const step = $(".slide").width();   // 창 너비 = 이미지 1장 너비
        $(".slide-img").css("transform", "translateX(" + (-slideIdx * step) + "px)");
        $(".slide-br li").removeClass("on").eq(slideIdx).addClass("on");   // 바 표시 동기화
    }

    function nextSlide(){
        slideIdx = (slideIdx + 1) % slideTotal;   // 끝이면 처음으로 순환
        slideUpdate();
    }

    let slideTimer = setInterval(nextSlide, 3000);   // 3초마다 자동

    function resetSlideTimer(){   // 수동 조작 후 3초 카운트 다시 시작
        clearInterval(slideTimer);
        slideTimer = setInterval(nextSlide, 3000);
    }

    /* 이미지 클릭 → 다음으로 */
    $(".slide-img").on("click", function(){
        nextSlide();
        resetSlideTimer();
    });

    /* 바 클릭 → 해당 슬라이드로 바로 이동 */
    $(".slide-br li").on("click", function(){
        slideIdx = $(this).index();   // 몇 번째 li인지 (0부터)
        slideUpdate();
        resetSlideTimer();
    });

    /* 창 크기 바뀌면 위치 재계산 */
    $(window).on("resize", slideUpdate);

    /* ===== TOP 버튼 + 엘리베이터 : 스크롤 시 엘리베이터가 계속 아래로 밀림 (푸터 뒤로) ===== */
    const $topBtn = $(".top-btn");
    const $elevator = $(".elevator-box");
    const $footer = $("footer");
    const $scroller = $(".scroll-area");

    let elevatorCleared = false;
    let ticking = false;
    $scroller.on("scroll", function(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function(){
            const scrolled = $scroller[0].scrollTop;
            const viewportH = window.innerHeight;
            const footerTop = $footer.length ? $footer[0].getBoundingClientRect().top : Infinity;
            const nearFooter = footerTop < viewportH;

            /* TOP 버튼 : 300px 이상 & 푸터 안 겹칠 때만 */
            $topBtn.toggleClass("show", scrolled > 300 && !nearFooter);

            /* 엘리베이터 : 푸터 근처면 아래로, 배너(상단) 근처면 위로 밀림 */
            if ($elevator.length) {
                const topZone = 300;   /* 상단에서 위로 밀리는 구간 */
                if (nearFooter) {
                    const past = viewportH - footerTop;
                    $elevator[0].style.transform = "translateY(" + past + "px)";
                    elevatorCleared = false;
                } else if (window.innerWidth > 768 && scrolled < topZone) {
                    const up = topZone - scrolled;
                    $elevator[0].style.transform = "translateY(-" + up + "px)";
                    elevatorCleared = false;
                } else if (!elevatorCleared) {
                    $elevator[0].style.transform = "";
                    elevatorCleared = true;
                }
            }
            ticking = false;
        });
    });

    $topBtn.on("click", function(){
        $scroller.animate({ scrollTop: 0 }, 500);
    });
});