CREATE SCHEMA IF NOT EXISTS `bancked` DEFAULT CHARACTER SET latin1 ;
USE `bancked` ;

-- -----------------------------------------------------
-- Table `bancked`.`chofer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`chofer` (
  `apellido` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(20) NOT NULL,
  `dni` VARCHAR(10) NOT NULL,
  `id_chofer` INT(11) NOT NULL AUTO_INCREMENT,
  `fecha_nacimiento` DATE NOT NULL,
  PRIMARY KEY (`id_chofer`),
  UNIQUE INDEX `dni` (`dni` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 24
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`vehiculo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`vehiculo` (
  `carga_maxima` INT(11) NOT NULL,
  `id_vehiculo` INT(11) NOT NULL AUTO_INCREMENT,
  `marca` VARCHAR(20) NOT NULL,
  `matricula` VARCHAR(10) NOT NULL,
  `tara` INT(11) NOT NULL,
  `ano` INT(11) NOT NULL,
  `modelo` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_vehiculo`),
  UNIQUE INDEX `matricula_UNIQUE` (`matricula` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`tipo_viaje`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`tipo_viaje` (
  `carga` VARCHAR(30) NOT NULL,
  `nombre` VARCHAR(10) NOT NULL,
  `id_tipo` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id_tipo`))
ENGINE = InnoDB
AUTO_INCREMENT = 57
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`viaje`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`viaje` (
  `id_viaje` INT(11) NOT NULL AUTO_INCREMENT,
  `destino` VARCHAR(30) NOT NULL,
  `fecha` DATE NOT NULL,
  `peso_total` INT(11) NOT NULL,
  `origen` VARCHAR(30) NOT NULL,
  `hora` TIME NOT NULL,
  `id_chofer` INT(11) NOT NULL,
  `id_vehiculo` INT(11) NOT NULL,
  `id_tipo` INT(11) NOT NULL,
  PRIMARY KEY (`id_viaje`),
  INDEX `id_chofer` (`id_chofer` ASC) VISIBLE,
  INDEX `id_vehiculo` (`id_vehiculo` ASC) VISIBLE,
  INDEX `id_tipo` (`id_tipo` ASC) VISIBLE,
  CONSTRAINT `viaje_ibfk_1`
    FOREIGN KEY (`id_chofer`)
    REFERENCES `bancked`.`chofer` (`id_chofer`),
  CONSTRAINT `viaje_ibfk_2`
    FOREIGN KEY (`id_vehiculo`)
    REFERENCES `bancked`.`vehiculo` (`id_vehiculo`),
  CONSTRAINT `viaje_ibfk_3`
    FOREIGN KEY (`id_tipo`)
    REFERENCES `bancked`.`tipo_viaje` (`id_tipo`))
ENGINE = InnoDB
AUTO_INCREMENT = 32
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`usuario` (
  `rol` VARCHAR(15) NOT NULL,
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `permisos` INT(1) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `nickname` VARCHAR(20) NOT NULL,
  `email` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `id_usuario` (`id_usuario` ASC) VISIBLE,
  UNIQUE INDEX `nickname` (`nickname` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`gestiona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`gestiona` (
  `id_viaje` INT(11) NOT NULL,
  `id_usuario` INT(11) NOT NULL,
  `gestiona` VARCHAR(10),
  PRIMARY KEY (`id_viaje`, `id_usuario`),
  INDEX `id_usuario` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `gestiona_ibfk_1`
    FOREIGN KEY (`id_viaje`)
    REFERENCES `bancked`.`viaje` (`id_viaje`),
  CONSTRAINT `gestiona_ibfk_2`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `bancked`.`usuario` (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `bancked`.`mantenimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bancked`.`mantenimiento` (
  `id_mantenimiento` INT(11) NOT NULL AUTO_INCREMENT,
  `service_proximo` DATE NOT NULL,
  `fecha` DATE NOT NULL,
  `observaciones` VARCHAR(100) NOT NULL,
  `id_vehiculo` INT(11) NOT NULL,
  PRIMARY KEY (`id_mantenimiento`),
  INDEX `id_vehiculo` (`id_vehiculo` ASC) VISIBLE,
  CONSTRAINT `mantenimiento_ibfk_1`
    FOREIGN KEY (`id_vehiculo`)
    REFERENCES `bancked`.`vehiculo` (`id_vehiculo`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
