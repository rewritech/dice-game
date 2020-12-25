## For Production
```bash
$ docker-compose -f docker-compose-production.yml up -d --build
```

## For Development
```bash
$ docker-compose up --build # 빌드 + 서버기동, --build옵션은 처음 한번만
$ docker-compose down # docker 종료
$ docker-compose exec client /bin/bash # 내부접속(client)
```

## Production과 Development환경의 차이점
### 구조
1. Production
```
Reverse Proxy(Nginx) <-> Web Server(Nginx + Builded Angular)
Reverse Proxy(Nginx) <-> Api Server(express.js) <-> MongoDB
Reverse Proxy(Nginx) <-> WebSocket Server(express.js)
```

2. Development
```
Web Server(Angular) <-> Api Server(express.js) <-> MongoDB
Web Server(Angular) <-> WebSocket Server(express.js)
```

### 포트
1. Production
```
Reverse Proxy(Nginx) : 80
Web Server(Nginx) : 8720
Api Server(express.js) : 7145
WebSocket Server(express.js) : 5417
MongoDB : 27017
```

2. Development
```
Web Server(Angular) : 4200
Api Server(express.js) : 3000
WebSocket Server(express.js) : 3001
MongoDB : 27017
```