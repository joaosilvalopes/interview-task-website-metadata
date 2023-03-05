# Retreive website metadata

### Build and install package

```
npm run build && npm i -g ./
```

### Run package

```
parsewebsitemetadata --url https://example.com/ --outputFile output.json --outputFormat json
```

```
parsewebsitemetadata -u https://example.com/ -out output.json -format json
```

### Run tests

You need to build the project before testing to test the main cli program

```
npm run build
```

```
npm run test
```