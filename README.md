[![Pipeline](https://github.com/taller2-grupo5-rostov-1c2022/android-app/actions/workflows/pipeline.yml/badge.svg)](https://github.com/taller2-grupo5-rostov-1c2022/android-app/actions/workflows/pipeline.yml) [![codecov](https://codecov.io/gh/taller2-grupo5-rostov-1c2022/android-app/branch/master/graph/badge.svg?token=OJS5A87F2G)](https://codecov.io/gh/taller2-grupo5-rostov-1c2022/android-app)

# Android App

## Set Up

### Node 16

##### Using [Node Version Manager](https://github.com/nvm-sh/nvm)

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ nvm install 16
```

##### Just Node

Download and run the installer from [nodejs.org](https://nodejs.org)

### Dependencies

```
npm i
```

## Running the app in development

- Default: `npm start`
- Android: `npm run android`
- Web: `npm run web`

## Building the apk

```
npm run build
```

> WIP : This may not work locally, should add a Docker Image to build the app

## Workflow - CI/CD

- Cancel Redundant Workflows
- Setup ( Checkout Repo , Install Node & Dependencies )
- Run Linter
- Run Tests
- Upload Test Coverage
- Build & Upload APK

### Upload Coverage to Codecov

The pipeline automatically generates a coverage report and uploads it to [codecov](https://codecov.io/gh/NicolasEzequielZulaicaRivera/nodeserver)

You'll need to set the following actions secrets:

- `CODECOV_TOKEN`: Repo Token
  > Can be obtained on codecov when setting up or on settings

### Build & Upload APK

- [Deliver Artifact](https://github.com/marketplace/actions/react-native-android-build-apk)
- [Release](https://github.com/softprops/action-gh-release)

#### Creating & Pushing Tags

```
$ git tag v0.1.0
$ gut push origin --tags
```

> keep tag version aligned with `package.json`
> this could be automated

## Firebase

- [Firebase Web - Docs](https://firebase.google.com/docs/auth/web/start)
