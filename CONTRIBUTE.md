# CONTRIBUTE

## Develop
```sh
npm install
npm start
```

Access: http://localhost:5173/mindmaptree

## Publish

#### publish core npm

Build core：
```sh
npm run build:core
```

Alter package.json version，then publish：

```sh
cd core
npm publish
```

#### publish page
git checkout to `gh-pages` branch，then run：

```sh
npm run build
git add .
git commit -m "some commit"
git push origin gh-pages
```