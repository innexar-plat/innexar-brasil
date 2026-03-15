# 🌐 Innexar Website

Website profissional da Innexar - Soluções em tecnologia, desenvolvimento de software, infraestrutura e serviços de consultoria.

## 🚀 Tecnologias

- **Next.js 16.0.1** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **next-intl** - Internacionalização (PT, EN, ES)
- **Framer Motion** - Animações

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 🌍 Idiomas

O site suporta 3 idiomas:
- 🇧🇷 Português: `/pt`
- 🇺🇸 Inglês: `/en`
- 🇪🇸 Espanhol: `/es`

## 🚀 Deploy

Para instruções completas de deploy em servidor Linux, consulte o [**Guia de Deploy**](./DEPLOY.md).

### Deploy Rápido

```bash
# Com Docker (recomendado)
docker-compose up -d --build

# Com script automatizado
chmod +x deploy.sh
./deploy.sh docker  # ou pm2, systemd
```

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Iniciar servidor de produção
- `npm run lint` - Verificar código

## 🔁 CI

Este app inclui workflows proprios em `.github/workflows` para uso no repositorio individual:

- `ci.yml`: lint, teste e build
- `docker.yml`: build e publish da imagem no GHCR

## 📚 Documentação

- [Guia de Deploy](./DEPLOY.md) - Instruções completas para deploy
- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

## 📄 Licença

Proprietário - Innexar
