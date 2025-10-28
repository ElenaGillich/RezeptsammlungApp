package org.example.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    Cloudinary mockCloudinary = mock(Cloudinary.class);
    Uploader mockUploader = mock(Uploader.class);

    @InjectMocks
    private ImageService imageService;

    @Test
    void uploadImage_shouldReturnImageUrl() throws IOException {

        MockMultipartFile file = new MockMultipartFile("file", "fake image content".getBytes());
        Map expected = Map.of("url", "https://fake-url.com/test.jpeg");

        //WHEN
        when(mockCloudinary.uploader()).thenReturn(mockUploader);
        when(mockUploader.upload(any(), any())).thenReturn(expected);

        String actualUrl = imageService.uploadImage(file);

        //THEN
        assertNotNull(actualUrl);
        assertEquals(expected.get("url"), actualUrl);
        verify(mockCloudinary).uploader();
    }

    @Test
    void uploadImage_shouldReturnEmptyString_WhenCalledWithNullImage() throws IOException {

        //WHEN
        String actual = imageService.uploadImage(null);

        //THEN
        assertEquals("", actual);
    }

}