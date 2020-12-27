## For Production
```bash
$ ./docker-up.sh prod
$ ./docker-down.sh prod
```

## For Development
```bash
$ ./docker-up.sh dev
$ ./docker-down.sh dev
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