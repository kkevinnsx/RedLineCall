-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `idPerfil` VARCHAR(1) NOT NULL,
    `birthDay` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_cpf_key`(`cpf`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `viatura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enderecoDP` VARCHAR(191) NOT NULL,
    `numeroViatura` INTEGER NOT NULL,
    `modeloViatura` VARCHAR(191) NOT NULL,
    `placaViatura` VARCHAR(191) NOT NULL,
    `identificacao` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `viatura_placaViatura_key`(`placaViatura`),
    UNIQUE INDEX `viatura_identificacao_key`(`identificacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `localizacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ocorrencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data` DATETIME(3) NOT NULL,
    `motivo` VARCHAR(191) NOT NULL,
    `idLocalizacao` INTEGER NOT NULL,
    `idUsuario` INTEGER NOT NULL,
    `idViatura` INTEGER NOT NULL,

    INDEX `ocorrencia_idLocalizacao_fkey`(`idLocalizacao`),
    INDEX `ocorrencia_idUsuario_fkey`(`idUsuario`),
    INDEX `ocorrencia_idViatura_fkey`(`idViatura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conteudo` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NOT NULL,
    `idUsuario` INTEGER NOT NULL,
    `idViatura` INTEGER NOT NULL,

    INDEX `chat_idUsuario_fkey`(`idUsuario`),
    INDEX `chat_idViatura_fkey`(`idViatura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensagem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `audio` VARCHAR(191) NOT NULL,
    `ligacao` VARCHAR(191) NOT NULL,
    `idChat` INTEGER NOT NULL,

    INDEX `mensagem_idChat_fkey`(`idChat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ocorrencia` ADD CONSTRAINT `ocorrencia_idLocalizacao_fkey` FOREIGN KEY (`idLocalizacao`) REFERENCES `localizacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ocorrencia` ADD CONSTRAINT `ocorrencia_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ocorrencia` ADD CONSTRAINT `ocorrencia_idViatura_fkey` FOREIGN KEY (`idViatura`) REFERENCES `viatura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_idViatura_fkey` FOREIGN KEY (`idViatura`) REFERENCES `viatura`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_idChat_fkey` FOREIGN KEY (`idChat`) REFERENCES `chat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
