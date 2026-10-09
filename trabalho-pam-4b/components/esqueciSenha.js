import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function EsqueciSenha({ modoEscuro, aoRedefinirSenha, aoVoltar }) {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  function tratarRedefinicao() {
    if (!email.trim() || !novaSenha.trim() || !confirmarNovaSenha.trim()) {
      setMensagemErro('Preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setMensagemErro('As senhas não coincidem!');
      return;
    }

    setMensagemErro('');
    aoRedefinirSenha(email, novaSenha);
  }

  return (
    <View style={[styles.fundo, modoEscuro && styles.fundoEscuro]}>
      <View style={[styles.cartao, modoEscuro && styles.cartaoEscuro]}>
        <Text style={[styles.titulo, modoEscuro && styles.textoEscuro]}>Recuperar Senha</Text>

        {mensagemErro !== '' && (
          <Text style={styles.textoErro}>{mensagemErro}</Text>
        )}

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>E-mail Cadastrado</Text>
          <TextInput
            style={[styles.input, modoEscuro && styles.inputEscuro]}
            placeholder="Digite seu e-mail"
            placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
            value={email}
            onChangeText={(t) => { setEmail(t); setMensagemErro(''); }}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Nova Senha</Text>
          <TextInput
            style={[styles.input, modoEscuro && styles.inputEscuro]}
            placeholder="Digite a nova senha"
            placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
            secureTextEntry
            value={novaSenha}
            onChangeText={(t) => { setNovaSenha(t); setMensagemErro(''); }}
          />
        </View>

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Confirmar Nova Senha</Text>
          <TextInput
            style={[styles.input, modoEscuro && styles.inputEscuro]}
            placeholder="Confirme a nova senha"
            placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
            secureTextEntry
            value={confirmarNovaSenha}
            onChangeText={(t) => { setConfirmarNovaSenha(t); setMensagemErro(''); }}
          />
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={tratarRedefinicao}>
          <Text style={styles.textoBotaoSalvar}>Redefinir Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={aoVoltar} style={styles.botaoVoltar}>
          <Text style={[styles.textoVoltar, modoEscuro && styles.textoSecundarioEscuro]}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fundoEscuro: {
    backgroundColor: '#121212',
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0D0D8',
  },
  cartaoEscuro: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  textoEscuro: {
    color: '#FFFFFF',
  },
  textoSecundarioEscuro: {
    color: '#AAAAAA',
  },
  textoErro: {
    color: '#E53935',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
  },
  campoGrupo: {
    marginBottom: 12,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  inputEscuro: {
    backgroundColor: '#2A2A2A',
    borderColor: '#333333',
    color: '#FFFFFF',
  },
  botaoSalvar: {
    backgroundColor: '#D81B60',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  botaoVoltar: {
    marginTop: 16,
    alignItems: 'center',
  },
  textoVoltar: {
    color: '#666666',
    fontSize: 13,
  },
});