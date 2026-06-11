# Test Checklist — The Solar Code

## SITIO PÚBLICO
- [x] Homepage — formulario "únete a los 144.000" con CountrySelect
- [x] Calculadora — formulario → página de resultado
- [x] Resultado personal — guardar lectura (sin login → modal auth → guarda)
- [ ] Resultado personal — desbloquear informe (sin login → modal auth → Stripe)
- [ ] Resultado personal — desbloquear informe (con login → Stripe con `client_reference_id`)
- [ ] Formulario pareja/grupo → página de resultado
- [ ] Resultado relacional — desbloquear informe (sin login → modal auth → Stripe)
- [ ] Resultado relacional — desbloquear informe (con login → Stripe)
- [ ] Forgot password — envío de email (pendiente Resend)

## DASHBOARD
- [ ] Mi Código — muestra sello, tono, elemento
- [ ] Código del Día — energía diaria + resonancia con el usuario
- [ ] Compatibilidad personal H2H — ilimitado, funciona
- [ ] Compatibilidad Tenis H2H — 1 gratis, luego consume crédito
- [ ] Conjuntos pareja — cálculo + paywall + compra €44
- [ ] Conjuntos grupo 3-5 personas — cálculo + paywall + compra €66
- [ ] Conjuntos grupo 6-8 personas — cálculo + paywall + compra €88
- [ ] Historial — muestra lecturas guardadas, se puede borrar
- [ ] Mis Informes — muestra los 3 tipos de informes comprados
- [ ] Ajustes — editar perfil

## WEBHOOK / STRIPE
- [ ] Compra informe completo → `fullReportPurchased = true` en DB
- [ ] Compra informe pareja → `coupleReportPurchased = true` en DB
- [ ] Compra informe grupo → `groupReportPurchased = true` en DB
- [ ] Compra créditos tenis → `tennisCredits` se incrementa en DB

## ADMIN
- [ ] Login con email admin → aparece "Panel Admin" en sidebar
- [ ] Buscar usuario por nombre/email
- [ ] Asignar créditos de tenis → se refleja en el usuario
- [ ] Exportar CSV
