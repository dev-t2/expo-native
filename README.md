1. 생활코딩 동영상 강의: https://wikibook.github.io/nodejs/mysql.html

2. MySQL 다운로드 : https://dev.mysql.com/downloads/installer/

3. MySQL 설치 : Authentication Method 옵션은 Use Legacy Authentication Method 선택 (필수!!)

4. MySQL 데이터베이스 설정 (MySQL Command Line Client) : https://opentutorials.org/module/3560/21175

```
  -- Table structure for table `author`

  CREATE TABLE `author` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `profile` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

  -- Dumping data for table `author`

  INSERT INTO `author` VALUES (1,'egoing','developer');
  INSERT INTO `author` VALUES (2,'duru','database administrator');
  INSERT INTO `author` VALUES (3,'taeho','data scientist, developer');

  -- Table structure for table `topic`

  CREATE TABLE `topic` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

  -- Dumping data for table `topic`

  INSERT INTO `topic` VALUES (1,'MySQL','MySQL is...','2018-01-01 12:10:11',1);
  INSERT INTO `topic` VALUES (2,'Oracle','Oracle is ...','2018-01-03 13:01:10',1);
  INSERT INTO `topic` VALUES (3,'SQL Server','SQL Server is ...','2018-01-20 11:01:10',2);
  INSERT INTO `topic` VALUES (4,'PostgreSQL','PostgreSQL is ...','2018-01-23 01:03:03',3);
  INSERT INTO `topic` VALUES (5,'MongoDB','MongoDB is ...','2018-01-30 12:31:03',1);
```

5. 패키지 설치 (VSCode Terminal) : npm install or npm i

6. '.env' 파일 생성 및 예시

```
  HOST=localhost
  USER=root
  DATABASE=opentutorials
  PASSWORD=111111
  BASE_URL=http://localhost:3000
  PORT=3000
```

7. 서버 실행 (VSCode Terminal) : npm run dev
