package com.andy.aicodehelper.ai.vision;

import dev.langchain4j.data.message.ImageContent;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

/**
 * Converts an uploaded file into image content for the Qwen-VL model.
 * Images are passed through directly; PDF pages are rendered to images
 * (preserving layout) so everything reaches the vision model the same way.
 */
@Component
@Slf4j
public class FileToImageContent {

    // Resumes are short; cap pages to bound vision-token cost on large PDFs.
    private static final int MAX_PDF_PAGES = 10;
    private static final float PDF_RENDER_DPI = 150f;

    public List<ImageContent> convert(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file uploaded.");
        }
        String contentType = file.getContentType();
        try {
            if (contentType != null && contentType.startsWith("image/")) {
                String base64 = Base64.getEncoder().encodeToString(file.getBytes());
                return List.of(ImageContent.from(base64, contentType));
            }
            if ("application/pdf".equals(contentType)) {
                return pdfToImages(file.getBytes());
            }
        } catch (IOException e) {
            log.error("Failed to read uploaded file '{}'", file.getOriginalFilename(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read the uploaded file.");
        }
        throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Unsupported file type: " + contentType + ". Upload an image (PNG/JPEG/WebP) or a PDF.");
    }

    private List<ImageContent> pdfToImages(byte[] pdfBytes) throws IOException {
        List<ImageContent> images = new ArrayList<>();
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            PDFRenderer renderer = new PDFRenderer(document);
            int pageCount = Math.min(document.getNumberOfPages(), MAX_PDF_PAGES);
            for (int page = 0; page < pageCount; page++) {
                BufferedImage image = renderer.renderImageWithDPI(page, PDF_RENDER_DPI, ImageType.RGB);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "png", baos);
                String base64 = Base64.getEncoder().encodeToString(baos.toByteArray());
                images.add(ImageContent.from(base64, "image/png"));
            }
        }
        return images;
    }
}
