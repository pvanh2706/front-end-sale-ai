<template>
  <div class="min-h-screen flex flex-col md:flex-row">

    <!-- Left Column: Branding (hidden on mobile, visible from md) -->
    <section
      class="hidden md:flex md:w-2/5 lg:w-[60%] flex-col justify-between items-start relative overflow-hidden p-8 lg:p-12"
      :style="pastelMeshStyle"
      aria-hidden="true"
    >
      <div class="z-10 w-full flex flex-col flex-1 justify-center">
        <!-- App logo + headline -->
        <div class="mb-10 lg:mb-12">
          <h2 class="flex items-center gap-3 text-2xl lg:text-[32px] font-bold tracking-tight text-gray-900 mb-3">
            <div class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            Salio
          </h2>
          <p class="text-gray-500 text-base lg:text-lg max-w-md leading-relaxed">
            Trợ lý thông minh cho đội ngũ Sales — Tối ưu hóa quy trình bán hàng với AI
          </p>
        </div>

        <!-- Dashboard illustration -->
        <div class="relative w-full aspect-video rounded-2xl overflow-hidden shadow-theme-xl border border-white/60">
          <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f0f4ff"/>
                <stop offset="100%" style="stop-color:#faf5ff"/>
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style="stop-color:#465fff;stop-opacity:0.18"/>
                <stop offset="100%" style="stop-color:#465fff;stop-opacity:0"/>
              </linearGradient>
              <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style="stop-color:#465fff"/>
                <stop offset="100%" style="stop-color:#818cf8"/>
              </linearGradient>
              <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style="stop-color:#c7d2fe"/>
                <stop offset="100%" style="stop-color:#e0e7ff"/>
              </linearGradient>
              <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#465fff" flood-opacity="0.08"/>
              </filter>
            </defs>

            <!-- Background -->
            <rect width="640" height="360" fill="url(#bgGrad)"/>

            <!-- ═══ HEADER (giống AppHeader thật) ═══ -->
            <rect x="0" y="0" width="640" height="40" fill="white"/>
            <line x1="0" y1="40" x2="640" y2="40" stroke="#e9edf2" stroke-width="1"/>
            <!-- Hamburger -->
            <rect x="10" y="15" width="14" height="1.5" rx="0.75" fill="#73839a"/>
            <rect x="10" y="19.5" width="10" height="1.5" rx="0.75" fill="#73839a"/>
            <rect x="10" y="24" width="14" height="1.5" rx="0.75" fill="#73839a"/>
            <!-- Logo icon -->
            <rect x="30" y="13" width="14" height="14" rx="3" fill="#8ea7f5"/>
            <rect x="32.5" y="14.5" width="2.5" height="10" rx="1" fill="white"/>
            <rect x="37" y="17" width="2.5" height="8" rx="1" fill="white" opacity="0.85"/>
            <rect x="41.5" y="15.5" width="2.5" height="10" rx="1" fill="white" opacity="0.65"/>
            <!-- "Salio" text -->
            <text x="49" y="24" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="#2b3446">Salio</text>
            <!-- Search bar -->
            <rect x="85" y="12" width="175" height="16" rx="5" fill="#f4f6f8" stroke="#e9edf2" stroke-width="1"/>
            <circle cx="97" cy="20" r="3.5" fill="none" stroke="#73839a" stroke-width="1.5"/>
            <line x1="99.5" y1="22.5" x2="101.5" y2="24.5" stroke="#73839a" stroke-width="1.5" stroke-linecap="round"/>
            <text x="106" y="23" font-family="Inter,sans-serif" font-size="7" fill="#b8c2d0">Tìm kiếm...</text>
            <!-- Right icons: theme -->
            <rect x="524" y="12" width="16" height="16" rx="4" fill="#f4f6f8" stroke="#e9edf2" stroke-width="1"/>
            <circle cx="532" cy="20" r="3.5" fill="none" stroke="#73839a" stroke-width="1.5"/>
            <!-- notification -->
            <rect x="546" y="12" width="16" height="16" rx="4" fill="#f4f6f8" stroke="#e9edf2" stroke-width="1"/>
            <path d="M554,16 a3,3 0 0,1 6,0 l0,4 l-6,0 Z" fill="none" stroke="#73839a" stroke-width="1.5" stroke-linejoin="round"/>
            <line x1="554" y1="24" x2="560" y2="24" stroke="#73839a" stroke-width="1.5"/>
            <!-- Avatar -->
            <circle cx="579" cy="20" r="10" fill="#8ea7f5"/>
            <text x="579" y="24" font-family="Inter,sans-serif" font-size="7" font-weight="700" fill="white" text-anchor="middle">AT</text>

            <!-- ═══ SIDEBAR (giống AppSidebar thật) ═══ -->
            <rect x="0" y="40" width="130" height="320" fill="white"/>
            <line x1="130" y1="40" x2="130" y2="360" stroke="#e9edf2" stroke-width="1"/>
            <!-- Sidebar logo -->
            <rect x="12" y="56" width="14" height="14" rx="3" fill="#8ea7f5"/>
            <rect x="14.5" y="57.5" width="2.5" height="10" rx="1" fill="white"/>
            <rect x="19" y="60" width="2.5" height="8" rx="1" fill="white" opacity="0.85"/>
            <rect x="23.5" y="58.5" width="2.5" height="10" rx="1" fill="white" opacity="0.65"/>
            <text x="30" y="67" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#2b3446">Salio</text>
            <!-- Group title -->
            <text x="12" y="86" font-family="Inter,sans-serif" font-size="6" font-weight="600" fill="#5f74bf" letter-spacing="0.8">MENU CHÍNH</text>
            <!-- Item 1: Chat tài liệu (inactive) -->
            <rect x="10" y="93" width="110" height="20" rx="6" fill="transparent"/>
            <rect x="18" y="97" width="9" height="9" rx="2" fill="#c3d3ff"/>
            <text x="32" y="106" font-family="Inter,sans-serif" font-size="7.5" fill="#47556b">Chat tài liệu</text>
            <polyline points="111,99 115,102 111,105" fill="none" stroke="#d8dee7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Item 2: CRM & Công việc (ACTIVE) -->
            <rect x="10" y="117" width="110" height="20" rx="6" fill="#edf1ff" stroke="#c3d3ff" stroke-width="1"/>
            <rect x="18" y="121" width="9" height="9" rx="2" fill="#8ea7f5"/>
            <text x="32" y="130" font-family="Inter,sans-serif" font-size="7.5" font-weight="600" fill="#5f74bf">CRM &amp; Công việc</text>
            <polyline points="111,123 115,127 111,131" fill="none" stroke="#8ea7f5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Sub-item: Deals Kanban (active) -->
            <rect x="28" y="141" width="94" height="15" rx="4" fill="#edf1ff"/>
            <circle cx="36" cy="148.5" r="2.5" fill="#8ea7f5"/>
            <text x="42" y="153" font-family="Inter,sans-serif" font-size="7" font-weight="600" fill="#5f74bf">Deals Kanban</text>
            <!-- Sub-item: Kiểm tra trùng -->
            <circle cx="36" cy="166.5" r="2.5" fill="#d8dee7"/>
            <text x="42" y="171" font-family="Inter,sans-serif" font-size="7" fill="#73839a">Kiểm tra trùng</text>
            <!-- Separator -->
            <line x1="10" y1="318" x2="120" y2="318" stroke="#e9edf2" stroke-width="1"/>
            <!-- Cài đặt -->
            <rect x="18" y="327" width="9" height="9" rx="2" fill="#d8dee7"/>
            <text x="32" y="335" font-family="Inter,sans-serif" font-size="7.5" fill="#73839a">Cài đặt</text>

            <!-- Main content area -->
            <!-- Stat cards row -->
            <rect x="148" y="56" width="108" height="60" rx="10" fill="white" filter="url(#cardShadow)"/>
            <text x="160" y="71" font-family="Inter,sans-serif" font-size="8" fill="#667085">Doanh thu tháng</text>
            <text x="160" y="88" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#101828">₫1.24 tỷ</text>
            <text x="160" y="102" font-family="Inter,sans-serif" font-size="8" fill="#12b76a">▲ 12.4% so tháng trước</text>
            <circle cx="238" cy="71" r="10" fill="#ecf3ff"/>
            <text x="238" y="75" font-family="Inter,sans-serif" font-size="11" text-anchor="middle" fill="#465fff">₫</text>

            <rect x="268" y="56" width="108" height="60" rx="10" fill="white" filter="url(#cardShadow)"/>
            <text x="280" y="71" font-family="Inter,sans-serif" font-size="8" fill="#667085">Deals đang mở</text>
            <text x="280" y="88" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#101828">142 deals</text>
            <text x="280" y="102" font-family="Inter,sans-serif" font-size="8" fill="#f79009">▲ 8 deals mới hôm nay</text>
            <circle cx="358" cy="71" r="10" fill="#ecfdf3"/>
            <text x="358" y="75" font-family="Inter,sans-serif" font-size="11" text-anchor="middle" fill="#12b76a">✦</text>

            <rect x="388" y="56" width="108" height="60" rx="10" fill="white" filter="url(#cardShadow)"/>
            <text x="400" y="71" font-family="Inter,sans-serif" font-size="8" fill="#667085">Tỉ lệ chuyển đổi</text>
            <text x="400" y="88" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="#101828">68.5%</text>
            <text x="400" y="102" font-family="Inter,sans-serif" font-size="8" fill="#465fff">▲ 3.2% so tuần trước</text>
            <circle cx="478" cy="71" r="10" fill="#fffaeb"/>
            <text x="478" y="75" font-family="Inter,sans-serif" font-size="11" text-anchor="middle" fill="#f79009">%</text>

            <rect x="508" y="56" width="118" height="60" rx="10" fill="#465fff"/>
            <text x="520" y="71" font-family="Inter,sans-serif" font-size="8" fill="white" opacity="0.7">Khách hàng mới</text>
            <text x="520" y="88" font-family="Inter,sans-serif" font-size="13" font-weight="700" fill="white">+38 KH</text>
            <text x="520" y="102" font-family="Inter,sans-serif" font-size="8" fill="white" opacity="0.6">Mục tiêu: 50 KH / tháng</text>
            <circle cx="606" cy="71" r="10" fill="white" opacity="0.2"/>
            <text x="606" y="75" font-family="Inter,sans-serif" font-size="11" text-anchor="middle" fill="white">★</text>

            <!-- Revenue chart card -->
            <rect x="148" y="130" width="338" height="170" rx="12" fill="white" filter="url(#cardShadow)"/>
            <text x="162" y="149" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#101828">Doanh thu theo tháng</text>
            <text x="162" y="161" font-family="Inter,sans-serif" font-size="8" fill="#667085">T1 – T8 · 2025</text>
            <rect x="418" y="141" width="56" height="20" rx="6" fill="#ecf3ff"/>
            <text x="446" y="155" font-family="Inter,sans-serif" font-size="8" font-weight="600" fill="#465fff" text-anchor="middle">8 tháng</text>
            <!-- Y-axis labels -->
            <text x="158" y="268" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="end">0</text>
            <text x="158" y="248" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="end">200M</text>
            <text x="158" y="228" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="end">500M</text>
            <text x="158" y="208" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="end">800M</text>
            <text x="158" y="190" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="end">1.2T</text>
            <!-- X-axis labels -->
            <text x="175" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T1</text>
            <text x="213" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T2</text>
            <text x="251" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T3</text>
            <text x="289" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T4</text>
            <text x="327" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T5</text>
            <text x="365" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T6</text>
            <text x="403" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T7</text>
            <text x="441" y="296" font-family="Inter,sans-serif" font-size="7" fill="#667085" text-anchor="middle">T8</text>

            <!-- Area chart -->
            <polyline points="162,270 196,248 230,255 264,230 298,238 332,210 366,218 400,195 434,205 468,182" fill="none" stroke="#465fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M162,270 196,248 230,255 264,230 298,238 332,210 366,218 400,195 434,205 468,182 468,285 162,285 Z" fill="url(#areaGrad)"/>
            <!-- Data points -->
            <circle cx="332" cy="210" r="4" fill="#465fff"/>
            <circle cx="468" cy="182" r="4" fill="#465fff"/>
            <!-- Tooltip -->
            <rect x="314" y="191" width="72" height="28" rx="6" fill="#101828"/>
            <text x="350" y="202" font-family="Inter,sans-serif" font-size="7" fill="white" opacity="0.6" text-anchor="middle">Tháng 5</text>
            <text x="350" y="214" font-family="Inter,sans-serif" font-size="9" font-weight="700" fill="white" text-anchor="middle">₫980M</text>
            <polygon points="346,219 354,219 350,224" fill="#101828"/>
            <!-- Grid lines -->
            <line x1="162" y1="285" x2="468" y2="285" stroke="#f2f4f7" stroke-width="1"/>
            <line x1="162" y1="265" x2="468" y2="265" stroke="#f2f4f7" stroke-width="1"/>
            <line x1="162" y1="245" x2="468" y2="245" stroke="#f2f4f7" stroke-width="1"/>
            <line x1="162" y1="225" x2="468" y2="225" stroke="#f2f4f7" stroke-width="1"/>
            <line x1="162" y1="205" x2="468" y2="205" stroke="#f2f4f7" stroke-width="1"/>

            <!-- Pipeline card -->
            <rect x="498" y="130" width="128" height="170" rx="12" fill="white" filter="url(#cardShadow)"/>
            <text x="510" y="149" font-family="Inter,sans-serif" font-size="10" font-weight="700" fill="#101828">Pipeline</text>
            <text x="510" y="161" font-family="Inter,sans-serif" font-size="8" fill="#667085">142 deals · 4 giai đoạn</text>
            <!-- Pipeline stages -->
            <rect x="510" y="170" width="104" height="24" rx="6" fill="#ecf3ff"/>
            <circle cx="522" cy="182" r="5" fill="#465fff"/>
            <text x="532" y="180" font-family="Inter,sans-serif" font-size="8" font-weight="600" fill="#465fff">Tiếp cận</text>
            <text x="532" y="190" font-family="Inter,sans-serif" font-size="7" fill="#667085">54 deals</text>
            <text x="606" y="185" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#465fff" text-anchor="end">38%</text>

            <rect x="510" y="200" width="104" height="24" rx="6" fill="#fffaeb"/>
            <circle cx="522" cy="212" r="5" fill="#f79009"/>
            <text x="532" y="210" font-family="Inter,sans-serif" font-size="8" font-weight="600" fill="#f79009">Demo / Báo giá</text>
            <text x="532" y="220" font-family="Inter,sans-serif" font-size="7" fill="#667085">41 deals</text>
            <text x="606" y="215" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#f79009" text-anchor="end">29%</text>

            <rect x="510" y="230" width="104" height="24" rx="6" fill="#ecfdf3"/>
            <circle cx="522" cy="242" r="5" fill="#12b76a"/>
            <text x="532" y="240" font-family="Inter,sans-serif" font-size="8" font-weight="600" fill="#12b76a">Đàm phán</text>
            <text x="532" y="250" font-family="Inter,sans-serif" font-size="7" fill="#667085">30 deals</text>
            <text x="606" y="245" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#12b76a" text-anchor="end">21%</text>

            <rect x="510" y="260" width="104" height="24" rx="6" fill="#f9fafb"/>
            <circle cx="522" cy="272" r="5" fill="#d0d5dd"/>
            <text x="532" y="270" font-family="Inter,sans-serif" font-size="8" font-weight="600" fill="#667085">Chờ ký HĐ</text>
            <text x="532" y="280" font-family="Inter,sans-serif" font-size="7" fill="#667085">17 deals</text>
            <text x="606" y="275" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#667085" text-anchor="end">12%</text>

            <!-- Bottom bar chart card -->
            <rect x="148" y="312" width="468" height="40" rx="10" fill="white" filter="url(#cardShadow)"/>
            <text x="160" y="327" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#101828">Top Sales</text>
            <text x="160" y="338" font-family="Inter,sans-serif" font-size="7" fill="#667085">Tuần này</text>
            <!-- Mini bars -->
            <rect x="222" y="322" width="10" height="18" rx="2" fill="url(#barGrad1)"/>
            <rect x="236" y="328" width="10" height="12" rx="2" fill="url(#barGrad2)"/>
            <rect x="250" y="318" width="10" height="22" rx="2" fill="url(#barGrad1)"/>
            <rect x="264" y="325" width="10" height="15" rx="2" fill="url(#barGrad2)"/>
            <rect x="278" y="320" width="10" height="20" rx="2" fill="url(#barGrad1)"/>
            <rect x="292" y="326" width="10" height="14" rx="2" fill="url(#barGrad2)"/>
            <rect x="306" y="317" width="10" height="23" rx="2" fill="url(#barGrad1)"/>
            <!-- Sales rep progress -->
            <text x="332" y="327" font-family="Inter,sans-serif" font-size="7" fill="#344054">Minh T.</text>
            <rect x="360" y="321" width="90" height="5" rx="2.5" fill="#f2f4f7"/>
            <rect x="360" y="321" width="72" height="5" rx="2.5" fill="#465fff" opacity="0.8"/>
            <text x="456" y="327" font-family="Inter,sans-serif" font-size="7" font-weight="700" fill="#465fff">₫420M</text>
            <text x="332" y="340" font-family="Inter,sans-serif" font-size="7" fill="#344054">Hà P.</text>
            <rect x="360" y="334" width="90" height="5" rx="2.5" fill="#f2f4f7"/>
            <rect x="360" y="334" width="60" height="5" rx="2.5" fill="#12b76a" opacity="0.8"/>
            <text x="456" y="340" font-family="Inter,sans-serif" font-size="7" font-weight="700" fill="#12b76a">₫350M</text>
            <text x="510" y="327" font-family="Inter,sans-serif" font-size="7" fill="#667085">Mục tiêu:</text>
            <text x="510" y="338" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#101828">₫500M</text>
            <text x="560" y="327" font-family="Inter,sans-serif" font-size="7" fill="#667085">Đạt được:</text>
            <text x="560" y="338" font-family="Inter,sans-serif" font-size="8" font-weight="700" fill="#465fff">84%</text>
          </svg>
          <div class="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none rounded-2xl"></div>
        </div>
      </div>

      <!-- Trusted by footer -->
      <div class="z-10 mt-8">
        <p class="text-xs font-medium uppercase tracking-widest text-gray-500 opacity-60">
          Trusted by teams at
        </p>
      </div>

      <!-- Decorative blobs -->
      <div class="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-40 bg-primary-100 pointer-events-none"></div>
      <div class="absolute bottom-[-5%] left-[10%] w-48 h-48 rounded-full blur-3xl opacity-50 bg-primary-50 pointer-events-none"></div>
    </section>

    <!-- Right Column: Registration Form -->
    <section class="flex-1 flex flex-col items-center justify-center px-6 py-10 md:px-10 md:py-12 lg:py-16 bg-white dark:bg-gray-900">
      <div class="w-full max-w-md space-y-7">

        <!-- Mobile only: logo + app name -->
        <div class="md:hidden flex flex-col items-center gap-3 mb-2">
          <div class="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Salio</h1>
        </div>

        <!-- Page title -->
        <header class="text-center md:text-left">
          <h1 class="text-3xl lg:text-[32px] font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
            Tạo tài khoản
          </h1>
          <p class="text-gray-500 text-base dark:text-gray-400">
            Bắt đầu trải nghiệm Salio miễn phí
          </p>
        </header>

        <!-- Registration form -->
        <form
          @submit.prevent="onSubmit"
          class="space-y-5"
          aria-label="Biểu mẫu tạo tài khoản"
          novalidate
        >
          <!-- Full name -->
          <FormField name="fullName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Họ và tên
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <User
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    autocomplete="name"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Company email -->
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Email công ty
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Mail
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="name@company.com"
                    type="email"
                    autocomplete="email"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Company name -->
          <FormField name="companyName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Tên doanh nghiệp/tổ chức
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Building2
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Công ty TNHH AI Solutions"
                    type="text"
                    autocomplete="organization"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Password -->
          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Lock
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    class="pl-12 pr-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Tối thiểu 8 ký tự"
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </FormControl>
              <!-- Password strength indicator -->
              <div
                v-if="passwordStrength > 0"
                class="flex items-center gap-1.5 mt-1.5 px-1"
                role="status"
                :aria-label="`Độ mạnh mật khẩu: ${passwordStrengthLabel}`"
              >
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="i <= passwordStrength ? strengthColorClass : 'bg-gray-200 dark:bg-gray-700'"
                ></div>
                <span class="text-[10px] font-semibold uppercase ml-1.5 min-w-[56px]" :class="strengthTextColorClass">
                  {{ passwordStrengthLabel }}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Confirm password -->
          <FormField name="confirmPassword" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Xác nhận mật khẩu
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <ShieldCheck
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="pl-12 pr-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Nhập lại mật khẩu"
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    :aria-label="showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Terms & conditions -->
          <div class="flex items-start gap-3 pt-1">
            <Checkbox
              id="terms"
              v-model:checked="agreedToTerms"
              class="mt-0.5 shrink-0"
              aria-required="true"
            />
            <label
              for="terms"
              class="text-sm text-gray-500 cursor-pointer select-none leading-relaxed dark:text-gray-400"
            >
              Tôi đồng ý với
              <a href="#" class="text-primary-500 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded">Điều khoản dịch vụ</a>
              và
              <a href="#" class="text-primary-500 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded">Chính sách bảo mật</a>
            </label>
          </div>

          <!-- Error message -->
          <p v-if="registerError" role="alert" class="text-sm text-error-500 text-center">
            {{ registerError }}
          </p>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading || !agreedToTerms"
            class="w-full h-12 bg-primary-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-theme-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            :aria-busy="isLoading"
          >
            <span v-if="isLoading">Đang tạo tài khoản...</span>
            <template v-else>
              <span>Tạo tài khoản</span>
              <ArrowRight class="w-4 h-4" aria-hidden="true" />
            </template>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center">
          <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span class="flex-shrink mx-4 px-2 text-xs font-medium text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
            Hoặc đăng ký với
          </span>
          <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <!-- SSO buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Đăng ký với Google"
          >
            <img src="https://www.google.com/favicon.ico" alt="" aria-hidden="true" class="w-5 h-5 object-contain" />
            Google
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Đăng ký với Microsoft"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1 1h10v10H1V1z" fill="#F25022" />
              <path d="M12 1h10v10H12V1z" fill="#7FBA00" />
              <path d="M1 12h10v10H1V12z" fill="#00A4EF" />
              <path d="M12 12h10v10H12V12z" fill="#FFB900" />
            </svg>
            Microsoft
          </button>
        </div>

        <!-- Login link -->
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Đã có tài khoản?
          <RouterLink
            to="/login"
            class="text-primary-500 font-bold ml-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            Đăng nhập
          </RouterLink>
        </p>
      </div>
    </section>
  </div>

  <!-- Email Conflict Dialog -->
  <EmailConflictDialog
    v-model="showEmailConflict"
    :email="conflictEmail"
    @go-to-login="handleGoToLogin"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, User, ShieldCheck } from 'lucide-vue-next'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import EmailConflictDialog from '@/components/common/EmailConflictDialog.vue'

const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const isLoading = ref(false)
const registerError = ref('')

const showEmailConflict = ref(false)
const conflictEmail = ref('')

const chartBars = [40, 65, 50, 80, 60, 75, 45, 70]

const pastelMeshStyle = {
  backgroundColor: '#faf8ff',
  backgroundImage: [
    'radial-gradient(at 0% 0%, hsla(225,100%,94%,1) 0, transparent 50%)',
    'radial-gradient(at 50% 0%, hsla(270,100%,95%,1) 0, transparent 50%)',
    'radial-gradient(at 100% 0%, hsla(330,100%,96%,1) 0, transparent 50%)',
  ].join(', '),
}

const schema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
      email: z.string().min(1, 'Vui lòng nhập email công ty').email('Email không hợp lệ'),
      companyName: z.string().min(2, 'Tên doanh nghiệp tối thiểu 2 ký tự'),
      password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    }),
)

const { handleSubmit, values } = useForm({ validationSchema: schema })

const passwordStrength = computed(() => {
  const pw = (values as Record<string, string>).password ?? ''
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const strengthColorClass = computed(() => {
  const map: Record<number, string> = {
    1: 'bg-error-500',
    2: 'bg-warning-500',
    3: 'bg-success-500',
    4: 'bg-success-500',
  }
  return map[passwordStrength.value] ?? 'bg-gray-200'
})

const strengthTextColorClass = computed(() => {
  const map: Record<number, string> = {
    1: 'text-error-500',
    2: 'text-warning-500',
    3: 'text-success-500',
    4: 'text-success-500',
  }
  return map[passwordStrength.value] ?? 'text-gray-500'
})

const passwordStrengthLabel = computed(() => {
  const map: Record<number, string> = {
    1: 'Yếu',
    2: 'Trung bình',
    3: 'Mạnh',
    4: 'Rất mạnh',
  }
  return map[passwordStrength.value] ?? ''
})

// Danh sách email đã tồn tại (mock — thay bằng API thực sau)
const EXISTING_EMAILS = ['admin@company.com', 'test@example.com']

const onSubmit = handleSubmit(async (vals) => {
  if (!agreedToTerms.value) {
    registerError.value = 'Vui lòng đồng ý với điều khoản dịch vụ'
    return
  }

  isLoading.value = true
  registerError.value = ''

  await new Promise((resolve) => setTimeout(resolve, 800))

  isLoading.value = false

  // Giả lập email đã tồn tại
  if (EXISTING_EMAILS.includes(vals.email.toLowerCase())) {
    conflictEmail.value = vals.email
    showEmailConflict.value = true
    return
  }

  toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.')
  router.push('/login')
})

function handleGoToLogin() {
  showEmailConflict.value = false
  router.push('/login')
}
</script>
