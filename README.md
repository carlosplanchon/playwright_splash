# playwright_splash
Simple Playwright scraper which receives an URL and returns the website code.

### Docker Image:
The Docker image for Playwright Splash can be found at
https://hub.docker.com/repository/docker/carlosplanchon/playwright_splash/general

### Running Playwright Splash:
To run Playwright Splash, use the following command:
```
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json -p 56572:56572 carlosplanchon/playwright_splash
```

Please note that this command uses the Microsoft Playwright image, and as such, you need to download the corresponding seccomp_profile.json file. You can find it here: https://playwright.dev/docs/docker and https://github.com/microsoft/playwright/blob/main/utils/docker/seccomp_profile.json.
