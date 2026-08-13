
	/* DOM 준비 후 즉시 실행 (script 태그가 body 끝에 있으므로 DOMContentLoaded 상태 보장) */
	(function () {
		try {
		const rooms   = document.querySelector('.rooms');
		const list    = document.querySelector('.rooms-list');
		const btnPrev = document.querySelector('.rooms-btn .prev');
		const btnNext = document.querySelector('.rooms-btn .next');
		const bar     = document.querySelector('.rooms-bar span');
		if (!rooms || !list) return;    /* 안전장치 : 요소 없으면 중단 */

		/* ---------- 순환 효과를 위한 카드 복제 (index/step 선언 前 먼저 처리) ---------- */
		const originals = Array.from(list.children);
		const totalReal = originals.length;
		if (totalReal < 2) return;      /* 카드가 2개 미만이면 캐러셀 X */

		/* 앞에 마지막 카드 복제, 뒤에 첫 카드 복제 */
		const cloneFirst = originals[0].cloneNode(true);
		const cloneLast  = originals[totalReal - 1].cloneNode(true);
		/* 클론된 video의 autoplay 제거 → 브라우저 비디오 리소스 중복 로드 방지 */
		[cloneFirst, cloneLast].forEach(function (c) {
			const v = c.querySelector('video');
			if (v) v.removeAttribute('autoplay');
		});
		cloneFirst.classList.add('clone');
		cloneLast.classList.add('clone');
		list.appendChild(cloneFirst);
		list.insertBefore(cloneLast, originals[0]);

		const cards = list.children;   /* 이제 카드 6장 : [301', video, 101, 201, 301, video'] */
		const total = cards.length;
		let index = 1;                  /* 초기 : 진짜 비디오 */
		let auto;
		let isMoving = false;           /* 전환 중 잠금 : 연속 클릭/자동슬라이드 겹침으로 인한 index 폭주 방지 */

		/* 카드 폭 + gap 을 뷰포트에 따라 계산 (모바일 : 82vw + 40, PC : 1200 + 40) */
		function getStep() {
			return (window.innerWidth < 768)
				? Math.round(window.innerWidth * 0.82) + 40
				: 1200 + 40;
		}
		let step = getStep();
		window.addEventListener('resize', function () {
			step = getStep();
			list.classList.remove('animate');
			list.style.transform  = 'translateX(' + (-index * step) + 'px)';
			void list.offsetWidth;
			requestAnimationFrame(function () { list.classList.add('animate'); });
		});

		/* 초기 위치 : CSS 기본에 transition 없음 → 즉시 transform 적용 (애니메이션 X) */
		list.style.transform  = `translateX(${-index * step}px)`;

		function updateUI() {
			for (let i = 0; i < total; i++) {
				cards[i].classList.toggle('on', i === index);
			}
			/* 프로그레스 바 : 실제 카드 기준 */
			const realIdx = ((index - 1) + totalReal) % totalReal;
			bar.style.width = `${((realIdx + 1) / totalReal) * 100}%`;
		}
		function move() {
			isMoving = true;
			list.style.transform = `translateX(${-index * step}px)`;
			updateUI();
		}
		function next() { if (isMoving) return; index++; move(); }
		function prev() { if (isMoving) return; index--; move(); }

		/* 클론 지점에 도달하면 애니메이션 없이 진짜 카드로 순간이동 */
		list.addEventListener('transitionend', (e) => {
			if (e.propertyName !== 'transform' || e.target !== list) return;
			if (index === 0) {                  /* 클론 301 → 진짜 301 */
				index = totalReal;
				jumpNoAnim();
			} else if (index === total - 1) {    /* 클론 video → 진짜 video */
				index = 1;
				jumpNoAnim();
			} else {
				isMoving = false;               /* 일반 전환 완료 → 잠금 해제 */
			}
		});
		function jumpNoAnim() {
			list.classList.remove('animate');
			list.style.transform  = `translateX(${-index * step}px)`;
			updateUI();
			void list.offsetWidth;
			requestAnimationFrame(function () {
				list.classList.add('animate');
				isMoving = false;               /* 순간이동 후 잠금 해제 */
			});
		}

		btnNext.addEventListener('click', next);
		btnPrev.addEventListener('click', prev);

		/* ---------- 자동 슬라이드 (hover 시 정지) ---------- */
		function startAuto() { stopAuto(); auto = setInterval(next, 4000); }
		function stopAuto()  { clearInterval(auto); }
		rooms.addEventListener('mouseenter', stopAuto);
		rooms.addEventListener('mouseleave', startAuto);

		updateUI();
		/* 강제 리플로우 후 다음 프레임에 .animate 클래스로 트랜지션 활성화 → 초기 로드 시 튐 방지 */
		void list.offsetWidth;
		requestAnimationFrame(function () {
			list.classList.add('animate');
			startAuto();
		});

		/* ---------- 모바일 햄버거 드로어 (header.open 토글) ---------- */
		const header    = document.querySelector('header');
		const hamburger = document.querySelector('.hamburger');
		const backdrop  = document.querySelector('.nav-backdrop');
		if (header && hamburger) {
			function closeMenu() {
				header.classList.remove('open');
				hamburger.textContent = '☰';
			}
			hamburger.addEventListener('click', function (e) {
				e.stopPropagation();
				const willOpen = !header.classList.contains('open');
				header.classList.toggle('open', willOpen);
				hamburger.textContent = willOpen ? '✕' : '☰';
			});
			if (backdrop) backdrop.addEventListener('click', closeMenu);
			document.querySelectorAll('.gnb a, .util a').forEach(function (a) {
				a.addEventListener('click', closeMenu);
			});
		}

		/* ---------- LP hover : 회전 + 오디오 재생 ---------- */
		list.querySelectorAll('.lp').forEach((lp) => {
			const img   = lp.querySelector('img');
			const audio = lp.querySelector('audio');
			if (!img || !audio) return;
			lp.addEventListener('mouseenter', () => {
				img.classList.add('spin');
				audio.play().catch(() => {});
			});
			lp.addEventListener('mouseleave', () => {
				img.classList.remove('spin');
				audio.pause();
			});
		});

		/* ---------- 맨 위로 버튼 : 300px 이상 스크롤 & 푸터와 안 겹칠 때만 표시 (101과 동일) ---------- */
		const topBtn = document.querySelector('.top-btn');
		const footer = document.querySelector('footer');
		if (topBtn) {
			window.addEventListener('scroll', () => {
				const scrolled  = window.scrollY;
				const viewportH = window.innerHeight;
				const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
				const nearFooter = footerTop < viewportH;
				topBtn.classList.toggle('show', scrolled > 300 && !nearFooter);
			});
			topBtn.addEventListener('click', () => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		}
		} catch (err) {
			/* 캐러셀 초기화 실패해도 카드는 CSS 기본값(전부 밝게)으로 보임 */
			console.error('rooms carousel init failed:', err);
		}
	})();