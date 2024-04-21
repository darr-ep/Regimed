import jwt
import datetime
import random
import string

# Función para generar un token de 6 caracteres aleatorios
def generar_token():
    caracteres = string.ascii_letters + string.digits  # Caracteres permitidos para el token
    token = ''.join(random.choice(caracteres) for _ in range(6))  # Generar un token de 6 caracteres
    return token

# Función para generar el token JWT con información adicional
def generar_token_jwt(usuario):
    tiempo_expiracion = datetime.datetime.utcnow() + datetime.timedelta(hours=2)  # Token válido por 2 horas
    token = generar_token()
    payload = {
        'usuario': usuario,
        'exp': tiempo_expiracion,
        'token': token
    }
    token_jwt = jwt.encode(payload, 'secreto', algorithm='HS256')
    return token_jwt

# Función para validar el token JWT y extraer el token de 6 caracteres
def validar_token_jwt(token_jwt):
    try:
        payload = jwt.decode(token_jwt, 'secreto', algorithms=['HS256'])
        expiracion = datetime.datetime.utcfromtimestamp(payload['exp'])
        if expiracion > datetime.datetime.utcnow():
            return True, payload['usuario'], payload['token']
        else:
            return False, None, None
    except jwt.ExpiredSignatureError:
        return False, None, None
    except jwt.InvalidTokenError:
        return False, None, None

# Ejemplo de uso
usuario = 'ejemplo_usuario'
token_jwt_generado = generar_token_jwt(usuario)
print("Token JWT generado:", token_jwt_generado)

valido, usuario_valido, token = validar_token_jwt(token_jwt_generado)
if valido:
    print("El token JWT es válido para el usuario:", usuario_valido)
    print("Token de 6 caracteres:", token)
else:
    print("El token JWT ha expirado o es inválido.")
