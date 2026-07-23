document.addEventListener('DOMContentLoaded', () => {
  const imagesWithFallbacks = document.querySelectorAll('img[data-fallback]');

  imagesWithFallbacks.forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        const mode = img.getAttribute('data-fallback');
        img.classList.add('hidden');

        if (mode === 'next-flex') {
          const fallbackElement = img.nextElementSibling;
          if (fallbackElement) {
            fallbackElement.classList.remove('hidden');
            fallbackElement.classList.add('flex');
          }
        }
      },
      { once: true }
    );
  });
});
