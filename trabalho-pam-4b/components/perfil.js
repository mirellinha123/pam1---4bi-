import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Perfil({ email, modoEscuro, aoSalvarPerfil, aoSair, aoVoltar }) {
  const [nome, setNome] = useState('Seu Nome');
  const [emailPerfil, setEmailPerfil] = useState(email || '');
  const [fotoUri, setFotoUri] = useState('https://avatar.iran.liara.run/public/65');

  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaFotoUri, setNovaFotoUri] = useState('');

  useEffect(() => {
    carregarPerfilSalvo();
  }, [email]);

  async function carregarPerfilSalvo() {
    try {
      const nomeSalvo = await AsyncStorage.getItem('@nome_usuario');
      const emailSalvo = await AsyncStorage.getItem('@email_usuario');
      const fotoSalva = await AsyncStorage.getItem('@foto_usuario');

      if (nomeSalvo) {
        setNome(nomeSalvo);
        setNovoNome(nomeSalvo);
      } else {
        setNovoNome('Seu Nome');
      }

      if (emailSalvo) {
        setEmailPerfil(emailSalvo);
        setNovoEmail(emailSalvo);
      } else if (email) {
        setEmailPerfil(email);
        setNovoEmail(email);
      }

      if (fotoSalva) {
        setFotoUri(fotoSalva);
        setNovaFotoUri(fotoSalva);
      }
    } catch (erro) {
      console.log('Erro ao carregar perfil:', erro);
    }
  }

  async function escolherFotoDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'É preciso permitir o acesso à galeria.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets[0].uri) {
      setNovaFotoUri(resultado.assets[0].uri);
    }
  }

  async function salvarAlteracoes() {
    if (!novoNome.trim() || !novoEmail.trim()) {
      Alert.alert('Atenção', 'Nome e E-mail não podem ficar vazios!');
      return;
    }

    try {
      await AsyncStorage.setItem('@nome_usuario', novoNome);
      await AsyncStorage.setItem('@email_usuario', novoEmail);

      let fotoParaSalvar = fotoUri;
      if (novaFotoUri) {
        await AsyncStorage.setItem('@foto_usuario', novaFotoUri);
        fotoParaSalvar = novaFotoUri;
        setFotoUri(novaFotoUri);
      }

      setNome(novoNome);
      setEmailPerfil(novoEmail);
      setEditando(false);

      if (aoSalvarPerfil) {
        aoSalvarPerfil(novoEmail, novoNome, fotoParaSalvar);
      }

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (erro) {
      console.log('Erro ao salvar perfil:', erro);
    }
  }

  function cancelarEdicao() {
    setNovoNome(nome);
    setNovoEmail(emailPerfil);
    setNovaFotoUri(fotoUri);
    setEditando(false);
  }

  return (
    <View style={[styles.container, modoEscuro && styles.fundoEscuro]}>
      <View style={[styles.cartao, modoEscuro && styles.cartaoEscuro]}>
        <Text style={[styles.titulo, modoEscuro && styles.textoEscuro]}>Perfil do Usuário</Text>

        <View style={styles.caixaFotoContainer}>
          <View style={styles.caixaFoto}>
            <Image
              source={{ uri: editando ? (novaFotoUri || fotoUri) : fotoUri }}
              style={styles.fotoCirculo}
            />

            <TouchableOpacity
              style={styles.botaoLapis}
              onPress={() => {
                if (!editando) setEditando(true);
                escolherFotoDaGaleria();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {editando && (
            <TouchableOpacity style={styles.botaoTrocarFoto} onPress={escolherFotoDaGaleria}>
              <Text style={styles.textoTrocarFoto}>Escolher Foto da Galeria</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.divisor, modoEscuro && styles.divisorEscuro]} />

        {editando ? (
          <View>
            <View style={styles.campoGrupo}>
              <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Nome</Text>
              <TextInput
                style={[styles.input, modoEscuro && styles.inputEscuro]}
                value={novoNome}
                onChangeText={setNovoNome}
                placeholder="Digite seu nome"
                placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
              />
            </View>

            <View style={styles.campoGrupo}>
              <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>E-mail</Text>
              <TextInput
                style={[styles.input, modoEscuro && styles.inputEscuro]}
                value={novoEmail}
                onChangeText={setNovoEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.botoesEdicao}>
              <TouchableOpacity style={[styles.botaoCancelar, modoEscuro && styles.botaoCancelarEscuro]} onPress={cancelarEdicao}>
                <Text style={[styles.textoBotaoCancelar, modoEscuro && styles.textoEscuro]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
                <Text style={styles.textoBotaoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.linhaInfo}>
              <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>Nome:</Text>
              <Text style={[styles.valor, modoEscuro && styles.textoEscuro]}>{nome}</Text>
            </View>

            <View style={styles.linhaInfo}>
              <Text style={[styles.rotulo, modoEscuro && styles.textoSecundarioEscuro]}>E-mail:</Text>
              <Text style={[styles.valor, modoEscuro && styles.textoEscuro]}>{emailPerfil}</Text>
            </View>

            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => {
                setNovoNome(nome);
                setNovoEmail(emailPerfil);
                setNovaFotoUri(fotoUri);
                setEditando(true);
              }}
            >
              <Text style={styles.textoBotaoEditar}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoVoltar} onPress={aoVoltar}>
              <Text style={styles.textoBotaoVoltar}>Voltar para Tarefas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoSair} onPress={aoSair}>
              <Ionicons name="log-out-outline" size={18} color="#E53935" style={{ marginRight: 6 }} />
              <Text style={styles.textoBotaoSair}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    padding: 24,
    borderRadius: 12,
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
    textAlign: 'center',
    marginBottom: 16,
  },
  textoEscuro: {
    color: '#FFFFFF',
  },
  textoSecundarioEscuro: {
    color: '#AAAAAA',
  },
  caixaFotoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  caixaFoto: {
    position: 'relative',
  },
  fotoCirculo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#D81B60',
    backgroundColor: '#F5F5F5',
  },
  botaoLapis: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#D81B60',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  botaoTrocarFoto: {
    marginTop: 10,
  },
  textoTrocarFoto: {
    color: '#D81B60',
    fontSize: 13,
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0D0D8',
    marginVertical: 16,
  },
  divisorEscuro: {
    backgroundColor: '#333333',
  },
  linhaInfo: {
    marginBottom: 14,
  },
  rotulo: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '600',
    marginBottom: 4,
  },
  valor: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  campoGrupo: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333333',
  },
  inputEscuro: {
    backgroundColor: '#2A2A2A',
    borderColor: '#333333',
    color: '#FFFFFF',
  },
  botaoEditar: {
    borderWidth: 1,
    borderColor: '#D81B60',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  textoBotaoEditar: {
    color: '#D81B60',
    fontWeight: '600',
    fontSize: 14,
  },
  botaoVoltar: {
    backgroundColor: '#D81B60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoVoltar: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  botaoSair: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  textoBotaoSair: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
  botoesEdicao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoCancelarEscuro: {
    backgroundColor: '#2A2A2A',
  },
  textoBotaoCancelar: {
    color: '#666666',
    fontWeight: '600',
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#D81B60',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});