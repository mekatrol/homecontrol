# Swagger generation

## npm package
`npm i swagger-typescript-api`

## Just first time in .NET
```bash
pushd ./Mekatrol.Automatum.NodeServer
dotnet new tool-manifest
dotnet tool install Swashbuckle.AspNetCore.Cli
dotnet tool restore
popd
```

## Generate swagger.json
```bash
pushd ./Mekatrol.Automatum.NodeServer
dotnet tool install Swashbuckle.AspNetCore.Cli
dotnet tool restore
dotnet msbuild -t:CreateSwaggerJson
popd
```

```bash
swagger-typescript-api -p ../../automatum/Mekatrol.Automatum/Mekatrol.Automatum.NodeServer/swagger.json --axios -o ./src/services -n api-generated.ts --unwrap-response-data --templates src/services/api-templates
```

# Format code

```bash
dotnet format --verify-no-changes
```

```bash
dotnet format
```