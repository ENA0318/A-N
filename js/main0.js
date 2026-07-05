$(function () {

    /* ===== NAV 드롭다운 ===== */
    $(".navi > li").mouseover(function () {
        $(".submenu").stop(true).slideDown(220);
        $(".menu_bg").stop(true).slideDown(220);
    });
    $(".navi > li").mouseleave(function () {
        $(".submenu").stop(true).slideUp(180);
        $(".menu_bg").stop(true).slideUp(180);
    });

    /* ===== 헤더 스크롤 축소 ===== */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 60) {
            $("header").css("height", "78px");
            $(".menu_bg").css("top", "78px");
            $(".submenu").css("top", "78px");
        } else {
            $("header").css("height", "80px");
            $(".menu_bg").css("top", "80px");
            $(".submenu").css("top", "80px");
        }
    });

    /* ===== 이미지 슬라이드 ===== */
    var current = 0;
    var total = $(".slidelist > ul > li").length;

    function goSlide(index) {
        var slideWidth = $(".imgslide").width();
        $(".slidelist").stop(true).animate({ marginLeft: -(slideWidth * index) }, 850, "swing");
        $(".dot").removeClass("active").eq(index).addClass("active");
        $(".slide_counter .current").text(index === 0 ? "01" : "02");
        current = index;
    }

    var slideTimer = setInterval(function () {
        goSlide((current + 1) % total);
    }, 4500);

    $(".dot").click(function () {
        clearInterval(slideTimer);
        goSlide($(this).index());
        slideTimer = setInterval(function () { goSlide((current + 1) % total); }, 4500);
    });

    $(window).resize(function () {
        $(".slidelist").css("marginLeft", -($(".imgslide").width() * current));
    });

    /* ===== 카테고리 필터 ===== */
    $(".cat_btn").click(function () {
        $(".cat_btn").removeClass("active");
        $(this).addClass("active");
        var cat = $(this).data("cat");
        if (cat === "all") {
            $(".category_block").removeClass("hidden");
        } else {
            $(".category_block").each(function () {
                if ($(this).attr("id") === "cat_" + cat) {
                    $(this).removeClass("hidden");
                } else {
                    $(this).addClass("hidden");
                }
            });
        }
    });

    /* ===== 공지 모달 ===== */
    $(".modal_trigger").click(function () {
        $(".modal").addClass("active");
    });
    $(".btn").click(function () {
        $(".modal").removeClass("active");
    });
    $(".modal").click(function (e) {
        if ($(e.target).hasClass("modal")) $(".modal").removeClass("active");
    });

    /* ===== 동화책(캐러셀/슬라이드) 모달 ===== */
    $(".book_trigger").click(function (e) {
        e.preventDefault();
        
        // 1. 클릭한 카드의 data-book-src 값("사각사각.html" 등)을 가져옵니다.
        var iframeSrc = $(this).data("book-src");
        
        // 2. 통합 모달의 iframe src에 그 값을 넣어줍니다.
        $("#bookFrame").attr("src", iframeSrc);
        
        // 3. 모달을 화면에 띄웁니다.
        $("#bookModal").addClass("open");
    });

    // 닫기 버튼(✕) 클릭 시
    $("#bookCloseBtn").click(function () {
        $("#bookModal").removeClass("open");
        $("#bookFrame").attr("src", ""); // 백그라운드 재생 방지를 위해 비워줌
    });

    // 모달 바깥 검은 배경 클릭 시 닫기
    $("#bookModal").click(function (e) {
        if ($(e.target).is("#bookModal")) {
            $("#bookModal").removeClass("open");
            $("#bookFrame").attr("src", "");
        }
    });

    /* ===== 이미지 상세 모달 ===== */
    $(".img_trigger").click(function (e) {
        e.preventDefault();
        var src   = $(this).data("src") || $(this).find("img").attr("src");
        var title = $(this).data("title") || $(this).find(".work_name, .artwork_title").first().text();
        var year  = $(this).data("year")  || $(this).find(".work_year, .artwork_year").first().text();

        $("#imgModalImg").attr("src", src).attr("alt", title);
        $("#imgModalTitle").text(title);
        $("#imgModalYear").text(year);
        $("#imgModal").addClass("open");
    });
    $("#imgModalClose").click(function () {
        $("#imgModal").removeClass("open");
    });
    $("#imgModal").click(function (e) {
        if ($(e.target).is("#imgModal")) {
            $("#imgModal").removeClass("open");
        }
    });

    /* ===== 스크롤 페이드인 (Intersection Observer) ===== 
const fadeEls = document.querySelectorAll(
  ".section_artworks, .artwork_item, .category_block, .statement_inner"
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: "0px 0px -30px 0px" }); // threshold 0 = 1px만 걸려도 바로 발동
*/

});