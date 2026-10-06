export const flyToCart = (e: React.MouseEvent, imgSrc: string) => {
  const cartIcon = document.getElementById('cart-icon');
  if (!cartIcon) return;
  
  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.position = 'fixed';
  img.style.width = '60px';
  img.style.height = '60px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '50%';
  img.style.zIndex = '999999';
  img.style.pointerEvents = 'none';
  img.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  img.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.25, 1)';
  
  // Start position (at cursor)
  img.style.left = `${e.clientX - 30}px`;
  img.style.top = `${e.clientY - 30}px`;
  
  document.body.appendChild(img);
  
  // Trigger animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targetRect = cartIcon.getBoundingClientRect();
      img.style.left = `${targetRect.left + targetRect.width / 2 - 10}px`;
      img.style.top = `${targetRect.top + targetRect.height / 2 - 10}px`;
      img.style.width = '20px';
      img.style.height = '20px';
      img.style.opacity = '0';
      img.style.transform = 'scale(0.2)';
    });
  });
  
  // Cleanup
  setTimeout(() => {
    if (document.body.contains(img)) {
      document.body.removeChild(img);
    }
  }, 850);
};
