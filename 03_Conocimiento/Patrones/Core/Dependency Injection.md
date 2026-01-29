---
doc: pattern
area: Patrones
level: intermedio
tags:
  - pattern
  - architectural
  - dependency-injection
  - di
aliases:
  - DI
  - Inyección de dependencias
related:
  - Factory Method
  - Singleton
  - Service Locator
  - Inversion of Control
refs:
  - https://martinfowler.com/articles/injection.html
  - https://en.wikipedia.org/wiki/Dependency_injection
  - Clean Architecture (Robert C. Martin)
sticker: lucide//curly-braces
---

# Dependency Injection (DI)

## En una línea
En vez de que una clase cree sus dependencias, se las entregas desde afuera para reducir acoplamiento y mejorar testabilidad.

## Problema
Cuando una clase hace esto:
- Decide qué dependencia usar (acoplamiento fuerte)
- Decide cómo construirla (wiring mezclado con lógica de negocio)
- Se vuelve difícil de testear (no puedes reemplazar DB/API/etc.)

Señales típicas:
- Muchos `new` dentro de clases de negocio
- Uso de singletons globales “para acceder fácil”
- Tests difíciles porque todo está amarrado a implementaciones reales

## Solución
Separar responsabilidades:
- Las clases declaran qué necesitan (interfaces / contratos)
- Un “compositor” (tu app / main / contenedor DI) decide qué implementación inyectar
- La clase solo se enfoca en su lógica

Formas comunes:
- Constructor Injection (la más recomendada)
- Setter Injection
- Parameter Injection (por método)

## Cuándo usar
- Servicios con dependencias (repositorios, APIs, loggers, caches)
- Cuando quieres tests fáciles con mocks/fakes
- Cuando quieres intercambiar implementaciones (ej: EmailSender real vs fake)

## Cuándo NO usar
- Scripts muy pequeños donde el overhead no vale la pena
- Cuando terminas inyectando demasiadas dependencias a una clase (señal de mala separación)

## Trade-offs
Pros
- Menos acoplamiento
- Testabilidad excelente
- Sustituir implementaciones es fácil
- Mejor diseño (dependencias explícitas)

Contras
- Necesitas un “composition root” (un lugar donde conectas todo)
- Puede sentirse verboso al inicio
- Si abusas, creas wiring gigante (solución: módulos por capa)

## Variantes / alternativas
- Manual DI: tú mismo pasas dependencias (simple y recomendado para proyectos medianos)
- DI Container: herramienta que resuelve dependencias automáticamente (útil en apps grandes)
- Alternativa polémica: Service Locator (parecido pero esconde dependencias)

## Ejemplo mínimo

TypeScript (sin DI — acoplado)
```ts
class UserService {
  private repo = new PostgresUserRepo();
  private mail = new SmtpMailer();

  async register(email: string) {
    await this.repo.create(email);
    await this.mail.sendWelcome(email);
  }
}
```

TypeScript (con DI — limpio)
```ts
interface UserRepo {
  create(email: string): Promise<void>;
}

interface Mailer {
  sendWelcome(email: string): Promise<void>;
}

class UserService {
  constructor(private repo: UserRepo, private mail: Mailer) {}

  async register(email: string) {
    await this.repo.create(email);
    await this.mail.sendWelcome(email);
  }
}

// composition root (main/app)
const service = new UserService(new PostgresUserRepo(), new SmtpMailer());
```

TypeScript (test fácil con fakes)
```ts
class FakeRepo implements UserRepo {
  created: string[] = [];
  async create(email: string) {
    this.created.push(email);
  }
}

class FakeMailer implements Mailer {
  sent: string[] = [];
  async sendWelcome(email: string) {
    this.sent.push(email);
  }
}

const repo = new FakeRepo();
const mail = new FakeMailer();
const service = new UserService(repo, mail);

await service.register("a@b.com");
```

## Errores comunes
- Inyectar implementaciones concretas en vez de interfaces
- Meter DI en todas partes sin necesidad (ruido)
- Clase con demasiadas dependencias (señal de “God class”)
- Usar Service Locator pensando que es DI (no lo es)

## Checklist de implementación
- [ ] ¿Mis clases declaran dependencias como interfaces/contratos?
- [ ] ¿Tengo un único “composition root” donde conecto todo?
- [ ] ¿Puedo testear sin tocar DB/Red/FS?
- [ ] ¿Cada clase tiene pocas dependencias (ideal 1–4)?

## Relacionado
- [[Factory Method]]
- [[Singleton]]
- [[Service Locator]]
- [[Inversion of Control]]

## Referencias
- Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern
- Clean Architecture — Robert C. Martin
- Wikipedia — Dependency Injection
