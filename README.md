# Pic2GIF Converter

A free, privacy-focused web application that converts multiple images into animated GIFs. All processing happens in your browser - no server uploads required!

🌐 **Live Demo**: [https://YOUR_USERNAME.github.io/pic2gif-converter/](https://YOUR_USERNAME.github.io/pic2gif-converter/)

## Features

✨ **Key Features:**
- 📸 Convert up to 30 images into animated GIFs
- 🎯 Drag & drop interface for easy uploading
- 🔄 Reorder images by dragging
- ⏱️ Adjustable frame duration (0.1 - 10 seconds per frame)
- 📏 Automatic image resizing for optimal file sizes
- 🔒 100% client-side processing - your images never leave your device
- 📱 Mobile-friendly responsive design
- 💾 Direct download of generated GIFs

## How to Use

1. **Upload Images**: 
   - Click "Select Images" or drag and drop images onto the upload area
   - Supported formats: JPG, PNG, GIF, WebP

2. **Arrange Images**:
   - Drag and drop images in the grid to reorder them
   - Click the × button on any image to remove it

3. **Set Frame Duration**:
   - Adjust how long each image displays (in seconds)
   - Default is 1 second per frame

4. **Generate GIF**:
   - Click "Generate GIF" to create your animation
   - Watch the progress bar as your GIF is created

5. **Download**:
   - Click "Download GIF" to save to your device
   - File is named with a timestamp for easy organization

## Privacy & Security

🔐 **Your Privacy Matters:**
- All image processing happens locally in your browser
- No images are uploaded to any server
- No data collection or tracking
- No account or sign-up required
- Images are cleared from memory after processing

## Technical Details

**Built with:**
- Vanilla JavaScript (no framework dependencies)
- [gif.js](https://github.com/jnordberg/gif.js) - JavaScript GIF encoder
- [Sortable.js](https://github.com/SortableJS/Sortable) - Drag-and-drop library
- HTML5 Canvas API for image processing
- Web Workers for smooth performance

**Browser Requirements:**
- Modern browsers with ES6 support
- Chrome 60+, Firefox 60+, Safari 12+, Edge 79+

## Configuration

You can customize the following settings in `app.js`:

```javascript
const CONFIG = {
    MAX_IMAGES: 30,          // Maximum number of images
    DEFAULT_FRAME_DURATION: 1, // Default seconds per frame
    GIF_QUALITY: 10,         // GIF quality (1-20, lower is better)
    MAX_WIDTH: 800,          // Maximum GIF width
    MAX_HEIGHT: 600          // Maximum GIF height
};
```

## Self-Hosting

1. Clone the repository:
   ```bash
   git clone https://github.com/taymcquaya/pic2gif-converter.git
   ```

2. Open `index.html` in a web browser or serve with any static file server:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

3. Deploy to GitHub Pages:
   - Push to your GitHub repository
   - Go to Settings → Pages
   - Select source: Deploy from branch (main)
   - Your app will be available at `https://YOUR_USERNAME.github.io/pic2gif-converter/`

## Limitations

- Maximum 30 images per GIF (configurable)
- Large images are automatically resized to 800x600 max
- Processing time increases with image count and size
- Browser memory limits may affect very large images

## Future Enhancements

- [ ] Audio support for video creation
- [ ] Additional image filters and effects
- [ ] Custom watermark option
- [ ] Batch processing for multiple GIFs
- [ ] Progressive Web App (PWA) for offline use
- [ ] More output formats (WebP, APNG)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [gif.js](https://github.com/jnordberg/gif.js) by Johan Nordberg
- [Sortable.js](https://github.com/SortableJS/Sortable) by Lebedev Konstantin
- Icons from Heroicons

---

Made with ❤️ for the open-source community