set shell := ["cmd.exe", "/c"]

NODE_EXE := "npx"
KEYSTORE_NAME := "release"

# install project dependencies
[group("Development")]
setup:
    npm install

# remove node_modules, lockfile and install dependencies
[group("Development")]
setup-clean:
    if exist node_modules rmdir /S /Q node_modules
    if exist package-lock.json del package-lock.json
    npm install

# list the available recipes
[default]
list:
    @just --list --unsorted

# add dependencies compatible with expo version using expo install
[group("Development")]
add +library:
    {{ NODE_EXE }} expo install {{ library }}

# add development dependencies compatible with expo version using expo install
[group("Development")]
add-dev +library:
    {{ NODE_EXE }} expo install {{ library }} -- -D

# show expo router paths
[group("Development")]
sitemap:
    {{ NODE_EXE }} expo-router-sitemap

[group("Development")]
[private]
copy-keytool:
    copy {{ KEYSTORE_NAME }}.keystore android\app\{{ KEYSTORE_NAME }}.keystore

# move the split APKs generated for release
[group("Release")]
get-apks:
    rmdir /S /Q release && xcopy android\app\build\outputs\apk\release\*.apk %cd%\release\ /y /e /s

[group("Development")]
[private]
keytool days="1000":
    keytool -genkeypair -v -storetype PKCS12 -keystore {{ KEYSTORE_NAME }}.keystore -alias {{ KEYSTORE_NAME }}key -keyalg RSA -keysize 2048 -validity {{ days }}

# bundle the javascript, and run it on Expo Go
[group("Development")]
start-dev-go:
    {{ NODE_EXE }} expo start --android --go --clear

# bundle the javascript, and run it on the emulator device if "expo-dev-client" is installed
[group("Development")]
start-dev:
    {{ NODE_EXE }} expo start --android --clear

# check config and upgrade expo deps
[group("Upgrade")]
doctor:
    {{ NODE_EXE }} expo config --type public
    {{ NODE_EXE }} expo install --fix && {{ NODE_EXE }} expo-doctor

# generate the DEPENDENCIES.md file
[group("Upgrade")]
deps:
    {{ NODE_EXE }} dependex

# upgrade to latest expo sdk and fix issues
[group("Upgrade")]
upgrade:
    {{ NODE_EXE }} expo install expo@latest

# build the native deps if there has been any changes
[group("Build")]
prebuild:
    if exist android rmdir /S /Q android
    {{ NODE_EXE }} expo prebuild --clean

# create .abb (Android Application Bundle) required for Play Store submission
[group("Release")]
bundle:
    cd android && gradlew app:bundleRelease

# create standalone .apk for different ABIs (Application Binary Interface)
[group("Release")]
split:
    cd android && gradlew app:assembleRelease

# create debug build and start
[group("Development")]
build-dev:
    {{ NODE_EXE }} expo run:android --variant debug --device

# create "debugOptimized" (options: release|debug) build, and install on the emulator
[arg('mode', pattern='debug|debugOptimized|release')]
[group("Build")]
build mode="debugOptimized":
    {{ NODE_EXE }} expo run:android --variant {{ mode }}
