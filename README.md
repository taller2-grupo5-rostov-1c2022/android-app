[![Pipeline](https://github.com/taller2-grupo5-rostov-1c2022/android-app/actions/workflows/pipeline.yml/badge.svg)](https://github.com/taller2-grupo5-rostov-1c2022/android-app/actions/workflows/pipeline.yml)

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
cd android && ./gradlew assembleRelease
```

The output file will be on the folder `android/app/build/outputs/apk/release`

## Workflow - CI/CD

- Cancel Redundant Workflows
- Setup ( Checkout Repo , Install Node & Dependencies )
- Run Linter
- Run Tests
- Build & Upload APK

### Build & Upload APK

- [Deliver Artifact](https://github.com/marketplace/actions/react-native-android-build-apk)
- [Release](https://github.com/softprops/action-gh-release)

#### Creating & Pushing Tags

If a tag that starts with `v` is pushed, the apk will be built for the latest commit and a release will be created.

```
$ git tag v0.1.0
$ git push origin --tags
```

> Keep tag version aligned with `package.json`

## Firebase

- [Firebase Web - Docs](https://firebase.google.com/docs/auth/web/start)
