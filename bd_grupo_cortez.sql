-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: example
-- ------------------------------------------------------
-- Server version	8.4.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `idCategoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nombreCategoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES ('437d2aa4-63da-4494-9d1d-6c7f117b0466','categoría 3','2025-03-30 12:00:00','2025-03-30 12:37:00',1),('a2ed0c11-0702-4425-bbc2-3010e11af3d2','gasfiteria','2025-03-27 19:06:25','2025-03-27 19:08:15',1),('b06e2072-b3fd-47fe-aeab-6605c13b66d1','gas','2025-03-27 19:08:25','2025-03-30 12:04:15',0),('e9a3fdec-4516-46ae-ac8a-4a89474c4af2','categoría 2','2025-03-27 19:13:25','2025-03-30 12:02:17',1),('edfab999-d93d-4026-9c13-95b86052caa3','categoría 1','2025-03-27 19:13:25',NULL,1);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `idCompra` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cliente` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `comprobante` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `montoPagar` decimal(8,2) NOT NULL,
  `fechaComprobante` date DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idCompra`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES ('28154f64-b007-4028-b9a0-43cb2164dd3e','12345678987','b-0001',100.00,'2025-04-04','2025-04-05 11:18:48',1),('412e785a-9ee6-4683-afa5-e3a0b9a0d059','32323232','NV_00010',25.50,'2025-04-02','2025-04-05 11:29:09',1),('8b7cdb1b-f1a6-402e-9606-2b52437a491c','98765432198','F-001',115.00,'2025-04-04','2025-04-05 11:21:47',1),('be3aeff6-d02c-4370-ab8a-a9f1b06164a0','12345678','B-0202',14.40,'2025-03-21','2025-03-30 15:40:30',1),('cf5c20e1-800f-4a0e-b00b-a528355b9d40','32233232','F-001',2587.40,'2025-03-26','2025-03-30 15:14:09',1);
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobantes`
--

DROP TABLE IF EXISTS `comprobantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobantes` (
  `idComprobante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(10) NOT NULL,
  `ultimoComprobante` int NOT NULL,
  PRIMARY KEY (`idComprobante`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobantes`
--

LOCK TABLES `comprobantes` WRITE;
/*!40000 ALTER TABLE `comprobantes` DISABLE KEYS */;
INSERT INTO `comprobantes` VALUES (1,'NV',10);
/*!40000 ALTER TABLE `comprobantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_compra`
--

DROP TABLE IF EXISTS `detalle_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_compra` (
  `idDetalleCompra` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `idCompra` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `idProducto` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(8,2) NOT NULL,
  `montoTotal` decimal(8,2) NOT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idDetalleCompra`),
  KEY `fx_idCompra_idx_idx` (`idCompra`),
  KEY `fx_idProducto_idx_idx` (`idProducto`),
  CONSTRAINT `fx_idCompra_idx` FOREIGN KEY (`idCompra`) REFERENCES `compras` (`idCompra`),
  CONSTRAINT `fx_idProducto_idx` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_compra`
--

LOCK TABLES `detalle_compra` WRITE;
/*!40000 ALTER TABLE `detalle_compra` DISABLE KEYS */;
INSERT INTO `detalle_compra` VALUES ('007f4dc4-02c4-4b0a-890b-1061e5a95d4c','28154f64-b007-4028-b9a0-43cb2164dd3e','68cd79f0-dc51-4220-ac62-b9d0d317eaac',10,5.00,50.00,1),('5532aa92-1ae1-4b22-a33c-a1e559e97d32','412e785a-9ee6-4683-afa5-e3a0b9a0d059','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',17,1.50,25.50,1),('60401002-52e9-49d3-9948-ef2e2727f771','8b7cdb1b-f1a6-402e-9606-2b52437a491c','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',10,1.50,15.00,1),('72297647-4ef9-4d7e-b015-a36f6e4d0bdd','be3aeff6-d02c-4370-ab8a-a9f1b06164a0','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',18,0.80,14.40,1),('a736e84f-e753-49d9-b58d-87f5e1ac7c84','cf5c20e1-800f-4a0e-b00b-a528355b9d40','5402408d-2146-4bff-b887-49088ea8075e',50,50.90,2545.00,1),('f9dba5e5-f83a-46e2-9ccf-8970c3184013','cf5c20e1-800f-4a0e-b00b-a528355b9d40','6894d8f4-22ed-4476-86ed-8cd5e04c6370',2,21.20,42.40,1),('fba10108-9d1d-4771-b2cf-89a00ef36168','8b7cdb1b-f1a6-402e-9606-2b52437a491c','68cd79f0-dc51-4220-ac62-b9d0d317eaac',10,10.00,100.00,1),('fc2cae1c-b539-4842-9dee-f5a9653e0a0e','28154f64-b007-4028-b9a0-43cb2164dd3e','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',100,0.50,50.00,1);
/*!40000 ALTER TABLE `detalle_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_venta`
--

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_venta` (
  `idDetalleVenta` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `idVenta` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `idProducto` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(8,2) NOT NULL,
  `montoTotal` decimal(8,2) NOT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idDetalleVenta`),
  KEY `fx_idVenta_idx` (`idVenta`),
  KEY `fx_idProducto_idx` (`idProducto`),
  CONSTRAINT `fx_idProducto` FOREIGN KEY (`idProducto`) REFERENCES `productos` (`idProducto`),
  CONSTRAINT `fx_idVenta` FOREIGN KEY (`idVenta`) REFERENCES `ventas` (`idVenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_venta`
--

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
INSERT INTO `detalle_venta` VALUES ('0131615e-71b5-40eb-b787-53c5cca04161','37e04aa5-e08a-4f9b-9cc7-f7c89269e01e','6894d8f4-22ed-4476-86ed-8cd5e04c6370',7,10.43,73.01,1),('0d5255fb-1c01-4373-9bb2-24ce6d2405e3','27218631-2745-448a-ae8b-c2560e61d367','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',5,2.00,10.00,1),('1859f2be-bd40-4c93-8878-ec1f24134f75','2cb1d3db-911b-42e3-ab08-3242ad2eb600','68cd79f0-dc51-4220-ac62-b9d0d317eaac',1,10.00,10.00,1),('201a842d-ba80-4180-a8c7-c901a7b04415','37e04aa5-e08a-4f9b-9cc7-f7c89269e01e','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',7,2.00,14.00,1),('35376935-8141-4fcc-891d-d7be628a1c4b','897ba3d7-7060-4757-a67e-29e0839d2797','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',3,2.50,7.50,1),('418e7e65-9db6-46b5-835c-0153cc40fdb3','2a8ff9d0-5629-451b-8647-edae3c9605a4','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',7,1.80,12.60,1),('43aadee4-c1e3-4dd2-80a2-19890fcbb713','420d796a-96a7-4fc9-81cc-ba0f93072e3a','5402408d-2146-4bff-b887-49088ea8075e',2,99.00,198.00,1),('56269dd4-5b26-41cd-bcf7-eb572903bd3f','b10d28e4-926e-449c-a337-5a2b9347da60','5402408d-2146-4bff-b887-49088ea8075e',2,99.00,198.00,1),('5e8879ae-4c70-44f1-9f71-642f122ac627','2cb1d3db-911b-42e3-ab08-3242ad2eb600','5402408d-2146-4bff-b887-49088ea8075e',1,99.00,99.00,1),('5f4e74c9-2430-4525-be78-d2a77f3de921','92252a73-8b91-40ae-892f-dc1b72cf6f9e','6894d8f4-22ed-4476-86ed-8cd5e04c6370',2,11.50,23.00,1),('64bf92d0-1136-49be-80a6-ccd656702e17','2cb1d3db-911b-42e3-ab08-3242ad2eb600','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',1,2.50,2.50,1),('82fb2e43-daf1-4835-85a7-43514a95584f','5e2fc2ea-a90e-4639-81bc-45699a0fd9f8','6894d8f4-22ed-4476-86ed-8cd5e04c6370',1,11.50,11.50,1),('865f607e-438b-4861-bea4-2199364a7bfb','93fca31d-5c25-4b19-a5d7-acf9ee8d22dd','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',2,2.50,5.00,1),('983e83e4-ff15-499d-ac0e-16090705c7b6','c6a6e01a-cbf0-4fca-bfc4-07667f0469b9','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',1,2.50,2.50,1),('9bc10a54-fa0f-4fae-8305-5bb6ab8e495e','37e04aa5-e08a-4f9b-9cc7-f7c89269e01e','5402408d-2146-4bff-b887-49088ea8075e',7,80.90,566.30,1),('9f972196-26ff-4b11-800b-ad5b9a0ee721','70b0f05c-2dcf-4efd-8c99-41aef8556f07','a2783ce5-6fe2-4132-910b-2eaef9cbfbaf',2,1099.99,2199.98,1),('a6c77c7b-7b09-4c62-84b0-6e7cc71ac86a','92252a73-8b91-40ae-892f-dc1b72cf6f9e','5402408d-2146-4bff-b887-49088ea8075e',2,99.00,198.00,1),('abc30a81-e54f-4121-a1f1-85715ab4b33a','70b0f05c-2dcf-4efd-8c99-41aef8556f07','6894d8f4-22ed-4476-86ed-8cd5e04c6370',10,10.43,104.30,1),('abd5ec79-43c0-4a8e-a6e6-bc9102f4739a','78e79cdf-a8f3-4571-a80b-62ed1f65dc72','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',20,1.80,36.00,1),('c8ddd2df-41e2-4943-b30d-b47c84c40457','54550153-0147-4470-9049-2b0e25be6e81','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',50,2.50,125.00,1),('cc4b353a-91eb-4f11-8a4a-345ac5398fd2','811add10-6239-4a1a-94ba-788b26e9d679','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',2,2.50,5.00,1),('ce8535c7-6df2-4d68-8395-87d105b9bc39','27218631-2745-448a-ae8b-c2560e61d367','68cd79f0-dc51-4220-ac62-b9d0d317eaac',5,9.00,45.00,1),('d50dbef1-7b44-4c5d-b2b8-ded5baf823f4','ef93f0ff-68e4-414d-90ac-c56d8f7e2261','1a822e98-02d6-40b4-bd46-4d23ff02cfbb',2,2.50,5.00,1),('de9c29e0-693b-4f94-9630-50e8c457d109','897ba3d7-7060-4757-a67e-29e0839d2797','73266678-9767-4f3e-a748-237472f64dd2',3,678.00,2034.00,1),('e2b1fabf-32ea-46a9-8b35-a914724dde65','70b0f05c-2dcf-4efd-8c99-41aef8556f07','5402408d-2146-4bff-b887-49088ea8075e',1,99.00,99.00,1),('fe6fae77-1b81-484e-8eaa-775c118a341f','897ba3d7-7060-4757-a67e-29e0839d2797','80de6943-30b6-4e18-b6b5-3d251c85568d',3,237.00,711.00,1);
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `idProducto` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `idCategoria` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nombreProducto` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `marca` varchar(45) COLLATE utf8mb4_general_ci NOT NULL,
  `precio_unitario` decimal(8,2) NOT NULL,
  `precio_mayor` decimal(8,2) DEFAULT NULL,
  `stock` int NOT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idProducto`),
  KEY `fx_idCategoria_idx` (`idCategoria`),
  CONSTRAINT `fx_idCategoria` FOREIGN KEY (`idCategoria`) REFERENCES `categorias` (`idCategoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES ('1a822e98-02d6-40b4-bd46-4d23ff02cfbb','a2ed0c11-0702-4425-bbc2-3010e11af3d2','codo 1/2\'\'','coplas',2.50,2.00,55,'2025-03-30 15:39:11','2025-04-05 12:35:11',1),('5402408d-2146-4bff-b887-49088ea8075e','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 4','marca 4',99.00,80.90,65,'2025-03-30 15:12:58','2025-04-05 12:34:19',1),('6894d8f4-22ed-4476-86ed-8cd5e04c6370','edfab999-d93d-4026-9c13-95b86052caa3','producto 12','marca 12',11.50,10.43,5,'2025-03-30 15:12:58','2025-04-05 12:33:38',1),('68cd79f0-dc51-4220-ac62-b9d0d317eaac','edfab999-d93d-4026-9c13-95b86052caa3','producto 6','marca 6',10.00,9.00,44,'2025-03-30 15:12:58','2025-04-05 11:23:05',1),('73266678-9767-4f3e-a748-237472f64dd2','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 3','marca 3',678.00,678.00,37,'2025-03-30 15:12:58','2025-04-05 12:29:11',1),('80de6943-30b6-4e18-b6b5-3d251c85568d','edfab999-d93d-4026-9c13-95b86052caa3','producto 9','marca 9',237.00,237.25,11,'2025-03-30 15:12:58','2025-04-05 12:29:11',1),('9aa3ba6e-4f76-47a1-a37e-c45ae637d534','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 5','marca 5',101.00,101.00,30,'2025-03-30 15:12:58',NULL,1),('a2783ce5-6fe2-4132-910b-2eaef9cbfbaf','edfab999-d93d-4026-9c13-95b86052caa3','producto 1','marca 1',1299.99,1099.99,28,'2025-03-30 15:12:58','2025-03-30 15:36:50',1),('a823f39c-5f4c-4fac-9047-bfba590f0999','edfab999-d93d-4026-9c13-95b86052caa3','producto 10','marca 10',407.00,407.00,30,'2025-03-30 15:12:58',NULL,1),('d8518b05-ea3f-4dca-8cbd-e587ea36100c','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 8','marca 8',15.00,15.00,30,'2025-03-30 15:12:58',NULL,1),('f6c268a6-8fea-45fa-938d-a5f4f5d3a58a','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 7','marca 7',50.00,50.00,11,'2025-03-30 15:12:58',NULL,1),('f788dc65-db77-44ad-8c35-0e244d8c8fd1','edfab999-d93d-4026-9c13-95b86052caa3','producto 11','marca 11',1205.00,1205.00,32,'2025-03-30 15:12:58',NULL,1),('fb0f5153-7ea2-4ea0-8fab-421a40f4174f','e9a3fdec-4516-46ae-ac8a-4a89474c4af2','producto 2','marca 2',300.00,300.00,25,'2025-03-30 15:12:58',NULL,1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `nombreUsuario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `documento` char(11) COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `fechaActualizacion` datetime DEFAULT NULL,
  `estado` int DEFAULT '1',
  PRIMARY KEY (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('571614b1-394d-4700-946d-5915be774901','grupo e&j cortez','12345678','$2b$10$655PfSaqlNNgK0CvsKJQfutYs218c1vzwrNbFqPz2ECKEeKUjGbRq',NULL,NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `idVenta` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `cliente` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `comprobante` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `montoPagar` decimal(8,2) NOT NULL,
  `fechaCreacion` datetime DEFAULT NULL,
  `estado` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`idVenta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES ('27218631-2745-448a-ae8b-c2560e61d367','78654321','N1-001',55.00,'2025-04-05 11:23:05',1),('2a8ff9d0-5629-451b-8647-edae3c9605a4','12345678','B-002',12.60,'2025-03-30 15:39:44',1),('2cb1d3db-911b-42e3-ab08-3242ad2eb600','75432341','NV-0010',111.50,'2025-04-05 11:08:21',1),('37e04aa5-e08a-4f9b-9cc7-f7c89269e01e','12345678','NV-0001',653.31,'2025-04-05 12:27:58',1),('420d796a-96a7-4fc9-81cc-ba0f93072e3a','32323232','NV-0009',198.00,'2025-04-05 12:34:19',1),('54550153-0147-4470-9049-2b0e25be6e81','76767676','NV-0003',125.00,'2025-04-05 12:32:00',1),('5e2fc2ea-a90e-4639-81bc-45699a0fd9f8','76767676','NV-0005',11.50,'2025-04-05 12:33:38',1),('70b0f05c-2dcf-4efd-8c99-41aef8556f07','13245142132','F-001',2403.28,'2025-03-30 15:36:50',1),('78e79cdf-a8f3-4571-a80b-62ed1f65dc72','12345678','B-002',36.00,'2025-03-30 16:34:17',1),('811add10-6239-4a1a-94ba-788b26e9d679','23323232','NV-0007',5.00,'2025-04-05 12:33:59',1),('897ba3d7-7060-4757-a67e-29e0839d2797','98765432','NV-0002',2752.50,'2025-04-05 12:29:11',1),('92252a73-8b91-40ae-892f-dc1b72cf6f9e','43214325','F-3243',221.00,'2025-03-30 18:37:07',1),('93fca31d-5c25-4b19-a5d7-acf9ee8d22dd','32323232','NV-0006',5.00,'2025-04-05 12:33:49',1),('b10d28e4-926e-449c-a337-5a2b9347da60','87878787','NV-0008',198.00,'2025-04-05 12:34:09',1),('c6a6e01a-cbf0-4fca-bfc4-07667f0469b9','54545454','NV-0004',2.50,'2025-04-05 12:33:28',1),('ef93f0ff-68e4-414d-90ac-c56d8f7e2261','00000000','NV-0010',5.00,'2025-04-05 12:35:11',1);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 19:08:14
