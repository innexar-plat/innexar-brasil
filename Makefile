# Innexar Brasil – cada projeto é um repositório Git separado com seu próprio GitHub
# Uso: make push-websitebr | push-workspace | push-workspace-app (entra na pasta e dá git push)

push-websitebr:
	cd innexar-websitebr && git push origin main

push-workspace:
	cd innexar-workspace && git push origin main

push-workspace-app:
	cd innexar-workspace-app && git push origin main

# Portal e training: init e remote quando tiverem conteúdo
# push-portal:    cd innexar-portal && git push origin main
# push-training:  cd innexar-training && git push origin main

.PHONY: push-websitebr push-workspace push-workspace-app
