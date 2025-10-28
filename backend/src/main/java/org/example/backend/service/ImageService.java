package org.example.backend.service;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile imageFile) throws IOException {
        if (imageFile == null) {
            return "";
        }

        Map response = cloudinary.uploader().upload(imageFile.getBytes(), Map.of("resource_type", "auto"));

        return response.get("url").toString();
    }
}
