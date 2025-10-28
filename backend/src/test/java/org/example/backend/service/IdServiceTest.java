package org.example.backend.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class IdServiceTest {

    IdService idService = new IdService();

    @Test
    void randomIdTest_shouldGenerateRandomId(){
        assertNotNull(idService.randomId());
    }
}