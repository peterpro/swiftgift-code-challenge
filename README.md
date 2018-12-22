# swiftgift-code-challenge

### How to run
```sh
$ git clone git@github.com:peterpro/swiftgift-code-challenge.git
$ cd swiftgift-code-challenge/
$ cp .env.dist .env 
$ cd docker
$ docker-compose up -d
$ docker-compose run sg-app npm install
$ docker-compose run sg-app npm run dbinit
$ docker-compose up -d
```
###Usage

Getting insecure route:
```
curl -X GET localhost:3000/insecure
```

Authorization:
```sh
curl -X POST \
  http://localhost:3000/auth \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'login=Bob&password=qwerty'
```

Getting secured route:
```
curl -X GET \
  http://localhost:3000/secure \
  -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiQm9iIiwiaWF0IjoxNTQ1NzQ4NDYwfQ.LYy76g_29OKT9XCrr1zGJs0WJPpZd1Rjxkv37cUDJiU'
```

### Token authorization
I've chosen [JWT](https://jwt.io/) as auth method because it is de-facto industry standard for securing client-server interactions. 

### Limitations
Omitted:
- all security features (password salting & so on)
- module decomposition (all in single file)
- tests