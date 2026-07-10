
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

    /* ===== TOP 버튼: 스크롤 내리면 등장, 클릭 시 맨 위로 ===== */
    $(window).on("scroll", function(){
        $(".top-btn").toggleClass("show", $(this).scrollTop() > 300);
    });
    $(".top-btn").on("click", function(){
        $("html, body").animate({ scrollTop: 0 }, 500);
    });
});