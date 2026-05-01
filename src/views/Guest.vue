<script setup>
  import Sidebar from '@/components/Sidebar.vue'
  import Features from '@/components/Features.vue'
  
  const navLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Features', href: '#features' },
    { label: 'Contact', href: '#contact' }
  ]
  
  const features = [
    {
      title: 'Member Management',
      description: 'We make it easy for cooperatives to manage their membership. From registering new members to keeping records up-to-date, we ensure that all member information is accurate and accessible.',
      icon: '/src/assets/images/pen.png'
    },
    {
      title: 'Contribution Tracking',
      description: 'Our platform tracks every member’s savings and contributions in real time. This provides clear financial oversight, promotes transparency, and helps organizations maintain trust among members.',
      icon: '/src/assets/images/pen.png'
    },
    {
      title: 'Loan Management',
      description: 'Organizations can efficiently manage loan issuance, track balances, and ensure members stay informed about their financial commitments.',
      icon: '/src/assets/images/pen.png'
    },
    {
      title: 'Automated Dividend Calculation',
      description: 'We take the guesswork out of profit sharing. Our system calculates dividends automatically based on member contributions and participation, guaranteeing fair and timely distribution.',
      icon: '/src/assets/images/pen.png'
    }
  ]
  </script>
  
  <template>
    <!-- Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 lg:h-20">
          <!-- Logo -->
          <div>
            <img
              src="/src/assets/images/ChatGPT Image May 1, 2026, 07_29_26 PM.png"
              alt="CoopVault Logo"
              class="h-27 lg:h-30 w-auto"
            >
          </div>
  
          <!-- Desktop Links -->
          <div class="hidden lg:flex items-center gap-10">
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="relative text-gray-700 font-medium pb-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all after:duration-300 hover:after:w-full hover:text-green-600"
            >
              {{ link.label }}
            </a>
          </div>
  
          <!-- Desktop Buttons -->
          <div class="hidden lg:flex items-center gap-7">
            <a href="/login" class="px-5 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition font-semibold">
              Login
            </a>
            <a href="/signup" class="px-5 py-2 bg-linear-to-r from-green-600 to-green-800 text-white rounded-lg hover:to-green-900 transition font-semibold shadow-md hover:scale-103">
              Sign Up
            </a>
          </div>
  
          <Sidebar :nav-links="navLinks" />
        </div>
      </div>
    </nav>
  
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <img
          src="/src/assets/images/young-international-people-working-together-use-laptop.jpg"
          alt="Team collaborating with digital devices"
          class="w-full h-full object-cover object-center scale-110 sm:scale-100 md:object-top lg:object-center"
        />
        <div class="absolute inset-0 bg-black/65"></div>
      </div>
  
      <div class="relative z-10 text-center px-6 sm:px-8 lg:px-0 max-w-5xl mx-auto w-full">
        <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-tight">
          <span class="block">MANAGE YOUR COOPERATIVE</span>
          <span class="block mt-2 bg-linear-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            DIGITALLY & EFFICIENTLY
          </span>
        </h2>
  
        <p class="mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
          Say goodbye to paper records. CoopVault helps school cooperatives, church groups, staff unions, and community
          savings societies track members, contributions, loans, and more — all in one secure, easy-to-use platform.
        </p>
  
        <div class="mt-12">
          <a
            href="/signup"
            class="inline-block px-6 py-4 bg-linear-to-r from-green-600 to-blue-700 text-white rounded-lg hover:to-blue-900 font-semibold hover:scale-105 transition-all shadow-lg"          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  
    <!-- About Us Section -->
    <section id="about" class="py-16 sm:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-green-700 ">About Us</h2>
          <p class="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg ">
            Learn more about CoopVault and why it was created.
          </p>
        </div>
  
        <div class="bg-white rounded-3xl shadow-lg p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <!-- Text Content -->
          <div class="order-2 lg:order-1">
            <h3 class="text-2xl sm:text-3xl font-bold text-green-600 mb-6">
              Simplifying Cooperative Management
            </h3>
  
            <p class="text-gray-700 leading-relaxed mb-5">
              CoopVault is a digital cooperative management platform designed to help cooperative societies operate more efficiently by replacing manual, paper-based record keeping with a reliable digital system.
            </p>
  
            <p class="text-gray-700 leading-relaxed mb-5">
              The platform was developed to address common challenges such as record loss, calculation errors, lack of transparency, and time-consuming administrative processes faced by many cooperatives.
            </p>
  
            <p class="text-gray-700 leading-relaxed">
              CoopVault is suitable for school cooperatives, church groups, staff unions, and community savings societies that need a simple, secure, and easy-to-use solution to manage members, savings, loans, and meetings.
            </p>
          </div>
  
          <!-- Feature Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 order-1 lg:order-2">
            <div class="p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl shadow text-center flex flex-col justify-center items-center min-h-37.5">
              <h4 class="font-bold text-green-700 mb-2 text-lg">Transparency</h4>
              <p class="text-gray-600 text-sm">Clear and accurate records that build trust among members.</p>
            </div>
  
            <div class="p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl shadow text-center flex flex-col justify-center items-center min-h-37.5">
              <h4 class="font-bold text-green-700 mb-2 text-lg">Efficiency</h4>
              <p class="text-gray-600 text-sm">Faster operations with reduced administrative workload.</p>
            </div>
  
            <div class="p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl shadow text-center flex flex-col justify-center items-center min-h-37.5">
              <h4 class="font-bold text-green-700 mb-2 text-lg">Accessibility</h4>
              <p class="text-gray-600 text-sm">Easy-to-use interface suitable for all users.</p>
            </div>
  
            <div class="p-6 bg-linear-to-br from-green-50 to-green-100 rounded-2xl shadow text-center flex flex-col justify-center items-center min-h-37.5">
              <h4 class="font-bold text-green-700 mb-2 text-lg">Reliability</h4>
              <p class="text-gray-600 text-sm">Secure and consistent data storage for cooperative records.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Features Section -->
    <section id="features" class="py-16 sm:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-green-700">Features</h2>
          <p class="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Discover the key capabilities of CoopVault.
          </p>
        </div>
        <Features :features="features" />
      </div>
    </section>
  
    <!-- CTA Section -->
    <section class="py-16 sm:py-20 px-6">
      <div class="max-w-5xl mx-auto bg-linear-to-r from-green-600 to-green-800 rounded-3xl px-8 py-12 sm:py-16 text-center text-white shadow-xl">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Build Stronger Cooperatives</h2>
        <p class="text-base sm:text-lg lg:text-2xl mb-10 max-w-3xl mx-auto">
          Embrace the future of cooperation.<br class="hidden sm:block">
          Join our digital platform and manage members, savings, and growth with confidence and transparency.
        </p>
        <div class="bg-white inline-block mx-auto mt-8 px-10 py-5 rounded-xl hover:bg-gray-100 hover:scale-103 transition shadow-lg">
          <a href="/signup" class="text-green-800 text-lg font-bold">Get Started</a>
        </div>
      </div>
    </section>
  
    <!-- Partners Section -->
    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="text-center px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-green-600 mb-8">Trusted by Our Awesome Partners</h2>
        <div class="flex justify-center items-center">
          <img src="/src/assets/images/download.jpeg" alt="Partners" class="max-w-full h-auto rounded-lg shadow-md">
        </div>
      </div>
    </section>
  
    <!-- Footer / Contact -->
    <footer id="contact" class="bg-linear-to-r from-green-700 to-green-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center lg:text-left">
        <div>
          <h3 class="font-bold text-xl mb-4">Contact</h3>
          <p class="mb-2 text-sm sm:text-base">+2348153021298, +2347088527839</p>
          <a href="" class="mb-2 text-sm hover:underline sm:text-base">Email: info@coopvault.com</a>
          <div class="mt-2"><a href="" class="text-sm hover:underline sm:text-base">Instagram | Facebook | Youtube</a></div>
        </div>
  
        <div>
          <p class="font-bold text-xl mb-4">Company</p>
          <a href="#about" class="block mb-2 hover:underline text-sm sm:text-base">About Us</a>
          <a href="#features" class="block mb-2 hover:underline text-sm sm:text-base">Features</a>
          <a href="#contact" class="block mb-2 hover:underline text-sm sm:text-base">Contact</a>
        </div>
  
        <div>
          <p class="font-bold text-xl mb-4">Quick Links</p>
          <a href="#" class="block mb-2 hover:underline text-sm sm:text-base">Terms</a>
          <a href="#" class="block mb-2 hover:underline text-sm sm:text-base">Privacy</a>
          <a href="#" class="block mb-2 hover:underline text-sm sm:text-base">Blog</a>
        </div>
  
        <div>
          <p class="font-bold text-xl mb-4">Address</p>
          <p class="leading-relaxed text-sm sm:text-base">
            Delta State Innovation Hub<br>
            #1, DBS Junction, Okpanam Road<br>
            Beside Zenith Bank Plc, Asaba.
          </p>

          <div class="mt-10">
            <div class="flex items-center justify-center gap-2">
              <a href="" class="hover:underline text-base">Terms of use</a>
              <p class="text-base">|</p>
              <a href="" class="hover:underline text-base">Privacy Policy</a>
            </div>
            <p class="text-center text-base mt-2.5">All rights reserved © Copyright 2025 <br> CoopVault</p>
         </div>
        </div>
      </div>
    </footer>
  </template>
  