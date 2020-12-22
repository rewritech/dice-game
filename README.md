# 서버실행 방법 1
```bash
$ npm install
$ npm run build # angular수정하면 아래 명령어 실행해줘야함
$ npm start
```

# 서버실행 방법 2(개발 시 추천)
```bash
$ npm install -g @angular/cli@11.0.4 # 만약 설치되지 않았다면 실행
$ npm install -g nodemon # 만약 설치되지 않았다면 실행
$ ng serve # Angular 개발서버 포트번호 4200
$ nodemon ./app.js # 소켓서버 (nodemon: 서버 수정 사항 자동갱신해줌)
```
