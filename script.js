document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LOGIKA KALKULATOR HARGA (index.html)
    // ==========================================
    const hargaTotal = document.getElementById('harga-total');
    
    if (hargaTotal) {
        const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
        const basePrice = 50000; 

        const inputFoto = document.getElementById('input-foto');
        const inputTamu = document.getElementById('input-tamu');
        const chkKado = document.getElementById('chk-kado');
        const chkCerita = document.getElementById('chk-cerita');
        const chkLifetime = document.getElementById('chk-lifetime');
        const chkLagu = document.getElementById('chk-lagu');
        const chkVideo = document.getElementById('chk-video');

        const labelFoto = document.getElementById('label-foto');
        const labelTamu = document.getElementById('label-tamu');
        const sumFoto = document.getElementById('sum-foto');
        const sumTamu = document.getElementById('sum-tamu');
        const hargaCoret = document.getElementById('harga-coret');

        function updateCheckmarkState(checkboxId, iconId, rowId) {
            const el = document.getElementById(checkboxId);
            if (!el) return;
            const isChecked = el.checked;
            const iconEl = document.getElementById(iconId);
            const rowEl = document.getElementById(rowId);
            
            if (isChecked) {
                iconEl.className = 'fa-solid fa-check text-earth-500 transition-colors';
                rowEl.classList.add('bg-sage-50', 'border-sage-200');
                rowEl.classList.remove('bg-white', 'border-sage-100');
            } else {
                iconEl.className = 'fa-solid fa-check text-slate-200 transition-colors';
                rowEl.classList.remove('bg-sage-50', 'border-sage-200');
                rowEl.classList.add('bg-white', 'border-sage-100');
            }
        }

        function updateSliderState(value, rowId, iconClass) {
            const rowEl = document.getElementById(rowId);
            if (!rowEl) return;
            const iconEl = rowEl.querySelector('i');
            if(parseInt(value) > 0) {
                rowEl.classList.add('bg-sage-50', 'border-sage-200');
                iconEl.className = `${iconClass} w-5 text-earth-500`;
            } else {
                rowEl.classList.remove('bg-sage-50', 'border-sage-200');
                iconEl.className = `${iconClass} w-5 text-slate-400`;
            }
        }

        function hitungTotal() {
            let total = basePrice;
            
            // Perhitungan Foto
            const jmlFoto = inputFoto ? parseInt(inputFoto.value) : 0;
            total += (jmlFoto * 2000);
            if(labelFoto) labelFoto.innerText = jmlFoto + ' Foto';
            if(sumFoto) sumFoto.innerText = jmlFoto;
            if(inputFoto) updateSliderState(jmlFoto, 'row-foto', 'fa-regular fa-image');

            // Perhitungan Tamu
            const jmlTamu = inputTamu ? parseInt(inputTamu.value) : 0;
            total += (jmlTamu / 250) * 50000;
            if(labelTamu) labelTamu.innerText = jmlTamu + ' Tamu';
            if(sumTamu) sumTamu.innerText = jmlTamu;
            if(inputTamu) updateSliderState(jmlTamu, 'row-tamu', 'fa-solid fa-paper-plane');

            // Update UI Checkbox
            updateCheckmarkState('chk-kado', 'icon-kado', 'row-kado');
            updateCheckmarkState('chk-cerita', 'icon-cerita', 'row-cerita');
            updateCheckmarkState('chk-lifetime', 'icon-lifetime', 'row-lifetime');
            updateCheckmarkState('chk-lagu', 'icon-lagu', 'row-lagu');
            updateCheckmarkState('chk-video', 'icon-video', 'row-video');

            // Tambahkan harga jika dicentang
            if(chkKado && chkKado.checked) total += parseInt(chkKado.value);
            if(chkCerita && chkCerita.checked) total += parseInt(chkCerita.value);
            if(chkLifetime && chkLifetime.checked) total += parseInt(chkLifetime.value);
            if(chkLagu && chkLagu.checked) total += parseInt(chkLagu.value);
            if(chkVideo && chkVideo.checked) total += parseInt(chkVideo.value);

            hargaTotal.innerText = formatIDR(total);
            if(hargaCoret) hargaCoret.innerText = formatIDR(total + 30000);
        }

        // Tambahkan Event Listener ke semua input
        [inputFoto, inputTamu, chkKado, chkCerita, chkLifetime, chkLagu, chkVideo].forEach(el => {
            if(el) el.addEventListener('input', hitungTotal);
        });

        // Panggil saat load pertama kali
        hitungTotal();
    }


    // ==========================================
    // 2. LOGIKA KATALOG DESAIN (index.html)
    // ==========================================
    const categoryLinks = document.querySelectorAll('.category-link');
    const designCards = document.querySelectorAll('.design-card');
    const searchInput = document.getElementById('search-desain');

    if (designCards.length > 0) {
        let currentCategory = 'semua';
        let searchQuery = '';

        function applyFilters() {
            designCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const cardName = card.querySelector('h3').innerText.toLowerCase();
                
                const matchCategory = (currentCategory === 'semua' || cardCategory === currentCategory);
                const matchSearch = cardName.includes(searchQuery);

                if (matchCategory && matchSearch) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }

        function filterKatalog(category) {
            currentCategory = category;

            // Update URL parameters
            if (window.history.pushState) {
                const url = new URL(window.location);
                if (category === 'semua') {
                    url.searchParams.delete('category');
                } else {
                    url.searchParams.set('category', category);
                }
                window.history.pushState({}, '', url);
            }

            // Ubah state tombol kategori
            categoryLinks.forEach(link => {
                const badge = link.querySelector('span:last-child');
                if (link.dataset.target === category) {
                    link.className = 'category-link flex justify-between items-center bg-earth-50 text-earth-600 px-4 py-3 rounded-lg transition active-category';
                    if(badge) badge.className = 'bg-earth-200 text-earth-700 text-xs py-0.5 px-2.5 rounded-full font-bold';
                } else {
                    link.className = 'category-link flex justify-between items-center text-sage-700 hover:bg-sage-50 px-4 py-3 rounded-lg transition';
                    if(badge) badge.className = 'bg-sage-100 text-sage-600 text-xs py-0.5 px-2.5 rounded-full font-bold';
                }
            });

            applyFilters();
        }

        // Listener Kategori
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); 
                filterKatalog(link.dataset.target);
            });
        });

        // Listener Search
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase();
                applyFilters();
            });
        }

        // Inisialisasi dari URL saat load
        const urlParams = new URLSearchParams(window.location.search);
        const initialCategory = urlParams.get('category') || 'semua';
        filterKatalog(initialCategory);
    }


    // ==========================================
    // 3. LOGIKA FAQ ACCORDION & FILTER (faq.html)
    // ==========================================
    const faqBtns = document.querySelectorAll('.faq-btn');
    const faqCatBtns = document.querySelectorAll('.faq-cat-btn');
    const faqBoxes = document.querySelectorAll('.faq-box');
    const faqTitle = document.getElementById('faq-title');

    // Accordion
    if (faqBtns.length > 0) {
        faqBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const content = this.nextElementSibling;
                const parent = this.parentElement;
                
                if (icon.classList.contains('fa-plus')) {
                    icon.classList.replace('fa-plus', 'fa-minus');
                    parent.classList.replace('border-sage-200', 'border-earth-500');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.classList.add('mt-2');
                } else {
                    icon.classList.replace('fa-minus', 'fa-plus');
                    parent.classList.replace('border-earth-500', 'border-sage-200');
                    content.style.maxHeight = '0px';
                    content.classList.remove('mt-2');
                }
            });
        });
    }

    // Filter Kategori FAQ
    if (faqCatBtns.length > 0) {
        faqCatBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetCategory = this.dataset.target;
                
                if(faqTitle) {
                    faqTitle.innerText = this.querySelector('span:first-child').innerText;
                }

                faqCatBtns.forEach(l => {
                    l.className = 'faq-cat-btn flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold transition text-sage-700 hover:bg-sage-50';
                    const badge = l.querySelector('span:last-child');
                    if(badge) badge.className = 'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-bold bg-sage-100 text-sage-600';
                });

                this.className = 'faq-cat-btn flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold transition bg-earth-50 text-earth-600';
                const activeBadge = this.querySelector('span:last-child');
                if(activeBadge) activeBadge.className = 'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-bold bg-earth-200 text-earth-700';

                faqBoxes.forEach(box => {
                    if (targetCategory === 'semua' || box.dataset.category === targetCategory) {
                        box.style.display = 'block';
                    } else {
                        box.style.display = 'none';
                    }
                });
            });
        });
    }


    // ==========================================
    // 4. LOGIKA SCROLLSPY (Halaman S&K, Privasi, Refund)
    // ==========================================
    const scrollSections = document.querySelectorAll('.content-section');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (scrollSections.length > 0 && tocLinks.length > 0) {
        
        // Setup Observer untuk merubah warna menu kiri saat scroll konten kanan
        const observerOptions = {
            root: null,
            rootMargin: '-120px 0px -60% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Reset semua link ke default (sage)
                    tocLinks.forEach(link => {
                        link.classList.remove('bg-earth-50', 'text-earth-600');
                        link.classList.add('text-sage-700', 'hover:bg-sage-50');
                    });

                    // Set link aktif (earth)
                    const activeLink = document.querySelector(`.toc-link[data-target="${currentId}"]`);
                    if(activeLink) {
                        activeLink.classList.remove('text-sage-700', 'hover:bg-sage-50');
                        activeLink.classList.add('bg-earth-50', 'text-earth-600');
                    }
                }
            });
        }, observerOptions);

        scrollSections.forEach(section => {
            observer.observe(section);
        });

        // Klik Manual pada TOC Link
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    
                    // Menghitung offset scroll (kurangi navbar sticky ~110px)
                    const navHeight = 110;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update state warna langsung saat diklik
                    tocLinks.forEach(l => {
                        l.classList.remove('bg-earth-50', 'text-earth-600');
                        l.classList.add('text-sage-700', 'hover:bg-sage-50');
                    });
                    this.classList.remove('text-sage-700', 'hover:bg-sage-50');
                    this.classList.add('bg-earth-50', 'text-earth-600');
                }
            });
        });
    }


    // ==========================================
    // 5. PENGHITUNG KARAKTER FEEDBACK (feedback.html)
    // ==========================================
    const textarea = document.getElementById('pesan');
    const charCount = document.getElementById('char-count');

    if(textarea && charCount) {
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            // Ubah warna merah jika mentok 1000 karakter
            if(currentLength >= 1000) {
                charCount.classList.add('text-red-500');
                charCount.parentElement.classList.add('text-red-500');
            } else {
                charCount.classList.remove('text-red-500');
                charCount.parentElement.classList.remove('text-red-500');
            }
        });
    }


    // ==========================================
    // 6. GLOBAL SMOOTH SCROLL NAVBAR (#fitur, #harga, dll)
    // ==========================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        // Abaikan jika class toc-link (karena sudah dihandle ScrollSpy)
        if (!link.classList.contains('toc-link')) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    // Jarak navbar sticky atas
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

});