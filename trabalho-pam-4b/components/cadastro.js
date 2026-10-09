import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated
} from 'react-native';

function OlhoAnimado({ visivel, onPress }) {
  const animacao = useRef(new Animated.Value(visivel ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animacao, {
      toValue: visivel ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [visivel]);

  const alturaPupila = animacao.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 10],
  });

  const opacidadePupila = animacao.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.5, 1],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.botaoOlhoContainer}>
      <View style={styles.caixaOlho}>
        <Animated.View style={[styles.contornoOlho, { opacity: animacao }]}>
          <Animated.View style={[styles.pupila, { height: alturaPupila, opacity: opacidadePupila }]} />
        </Animated.View>
        <Animated.View
          style={[
            styles.linhaFechado,
            { opacity: animacao.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function Cadastro({ modoEscuro, aoCadastrar, aoVoltar }) {
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  function tratarCadastro() {
    if (!novoNome.trim() || !novoEmail.trim() || !novaSenha.trim() || !confirmarSenha.trim()) {
      setMensagemErro('Preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagemErro('As duas senhas precisam ser iguais!');
      return;
    }

    setMensagemErro('');
    aoCadastrar(novoEmail, novaSenha, novoNome);
  }

  return (
    <View style={[styles.fundo, modoEscuro && styles.fundoEscuro]}>
      <View style={[styles.cartao, modoEscuro && styles.cartaoEscuro]}>
        <Text style={[styles.titulo, modoEscuro && styles.textoEscuro]}>Criar Conta</Text>

        {mensagemErro !== '' && (
          <Text style={styles.textoErro}>{mensagemErro}</Text>
        )}

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Nome Completo</Text>
          <TextInput
            style={[styles.input, modoEscuro && styles.inputEscuro]}
            placeholder="Digite seu nome"
            placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
            value={novoNome}
            onChangeText={(t) => { setNovoNome(t); setMensagemErro(''); }}
          />
        </View>

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>E-mail</Text>
          <TextInput
            style={[styles.input, modoEscuro && styles.inputEscuro]}
            placeholder="Digite seu e-mail"
            placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
            value={novoEmail}
            onChangeText={(t) => { setNovoEmail(t); setMensagemErro(''); }}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Senha</Text>
          <View style={[styles.caixaInputComOlho, modoEscuro && styles.inputEscuro]}>
            <TextInput
              style={[styles.inputComOlho, modoEscuro && styles.textoEscuro]}
              placeholder="Digite sua senha"
              placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
              secureTextEntry={!mostrarSenha}
              value={novaSenha}
              onChangeText={(t) => { setNovaSenha(t); setMensagemErro(''); }}
            />
            <OlhoAnimado visivel={mostrarSenha} onPress={() => setMostrarSenha(!mostrarSenha)} />
          </View>
        </View>

        <View style={styles.campoGrupo}>
          <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Confirmar Senha</Text>
          <View style={[styles.caixaInputComOlho, modoEscuro && styles.inputEscuro]}>
            <TextInput
              style={[styles.inputComOlho, modoEscuro && styles.textoEscuro]}
              placeholder="Confirme sua senha"
              placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={(t) => { setConfirmarSenha(t); setMensagemErro(''); }}
            />
            <OlhoAnimado visivel={mostrarConfirmarSenha} onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} />
          </View>
        </View>

        <TouchableOpacity style={styles.botaoCadastrar} onPress={tratarCadastro}>
          <Text style={styles.textoBotaoCadastrar}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={aoVoltar} style={styles.botaoVoltar}>
          <Text style={[styles.textoVoltar, modoEscuro && styles.textoSecundarioEscuro]}>Já tem conta? Voltar ao Login</Text>
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
    fontSize: 22,
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
  caixaInputComOlho: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputComOlho: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },
  botaoOlhoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  caixaOlho: {
    width: 22,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contornoOlho: {
    width: 20,
    height: 12,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#D81B60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupila: {
    width: 8,
    backgroundColor: '#D81B60',
    borderRadius: 4,
  },
  linhaFechado: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#888888',
    borderRadius: 1,
  },
  botaoCadastrar: {
    backgroundColor: '#D81B60',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoCadastrar: {
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