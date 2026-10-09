import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Animated,
  Image,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LARGURA_ABA = 280;

function CheckboxAnimado({ concluida, onPress }) {
  const escala = useRef(new Animated.Value(1)).current;

  function aoPressionar() {
    Animated.sequence([
      Animated.timing(escala, { toValue: 0.85, duration: 90, useNativeDriver: true }),
      Animated.timing(escala, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onPress();
  }

  return (
    <TouchableOpacity onPress={aoPressionar} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.checkbox,
          concluida && styles.checkboxMarcado,
          { transform: [{ scale: escala }] },
        ]}
      >
        {concluida && <Text style={styles.textoCheck}>✓</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function Tarefas({
  textoTarefa,
  setTextoTarefa,
  listaTarefas,
  adicionarTarefa,
  deletarTarefa,
  alternarConcluida,
  usuarioLogado,
  dadosPerfil,
  modoEscuro,
  alternarTema,
  irParaLogin,
  irParaCadastro,
  irParaPerfilCompleto,
  aoSair
}) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [abaPerfilVisivel, setAbaPerfilVisivel] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [novoTexto, setNovoTexto] = useState('');

  const animacaoX = useRef(new Animated.Value(LARGURA_ABA)).current;

  useEffect(() => {
    Animated.timing(animacaoX, {
      toValue: abaPerfilVisivel ? 0 : LARGURA_ABA,
      duration: abaPerfilVisivel ? 250 : 200,
      useNativeDriver: true,
    }).start();
  }, [abaPerfilVisivel]);

  function fecharAba() {
    Animated.timing(animacaoX, {
      toValue: LARGURA_ABA,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setAbaPerfilVisivel(false));
  }

  const totalTarefas = listaTarefas.length;
  const tarefasConcluidas = listaTarefas.filter((t) => t.concluida).length;

  function abrirEdicao(item) {
    setTarefaEditando(item);
    setNovoTexto(item.texto);
    setModalVisivel(true);
  }

  function salvarEdicao() {
    if (!novoTexto.trim()) return;
    tarefaEditando.texto = novoTexto;
    setModalVisivel(false);
  }

  const uriFoto = dadosPerfil.foto && dadosPerfil.foto.trim() !== ''
    ? dadosPerfil.foto
    : null;

  return (
    <View style={[styles.fundo, modoEscuro && styles.fundoEscuro]}>
      <View style={styles.topoNavegacao}>
        <Text style={[styles.tituloApp, modoEscuro && styles.textoEscuro]}>Minhas Tarefas</Text>
        
        <TouchableOpacity style={styles.botaoPerfil} onPress={() => setAbaPerfilVisivel(true)}>
          {usuarioLogado && uriFoto ? (
            <Image source={{ uri: uriFoto }} style={styles.fotoTopoCirculo} />
          ) : (
            <Ionicons name="person-circle-outline" size={36} color="#D81B60" />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.caixaContador, modoEscuro && styles.caixaContadorEscuro]}>
        <Text style={[styles.textoContador, modoEscuro && styles.textoSecundarioEscuro]}>
          {tarefasConcluidas} de {totalTarefas} tarefas concluídas
        </Text>
      </View>

      <View style={[styles.caixaInputAdd, modoEscuro && styles.caixaInputAddEscuro]}>
        <TextInput
          style={[styles.inputTarefa, modoEscuro && styles.textoEscuro]}
          placeholder="Digite uma nova tarefa..."
          placeholderTextColor={modoEscuro ? '#888888' : '#9E9E9E'}
          value={textoTarefa}
          onChangeText={setTextoTarefa}
        />
        <TouchableOpacity style={styles.botaoAdd} onPress={adicionarTarefa}>
          <Text style={styles.textoBotaoAdd}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listaTarefas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        ListEmptyComponent={
          <Text style={[styles.textoVazio, modoEscuro && styles.textoSecundarioEscuro]}>
            Nenhuma tarefa cadastrada.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.itemLinha, modoEscuro && styles.itemLinhaEscuro]}>
            <CheckboxAnimado
              concluida={item.concluida}
              onPress={() => alternarConcluida(item.id)}
            />

            <Text style={[styles.textoTarefa, modoEscuro && styles.textoEscuro, item.concluida && styles.textoRisocado]}>
              {item.texto}
            </Text>

            <TouchableOpacity style={styles.botaoAcao} onPress={() => abrirEdicao(item)}>
              <Text style={[styles.textoAcaoEditar, modoEscuro && styles.textoSecundarioEscuro]}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoAcao} onPress={() => deletarTarefa(item.id)}>
              <Text style={styles.textoAcaoExcluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={abaPerfilVisivel} transparent animationType="fade">
        <View style={styles.fundoAbaOverlay}>
          <TouchableOpacity style={styles.areaTransparente} onPress={fecharAba} activeOpacity={1} />

          <Animated.View style={[styles.conteudoAbaLateral, modoEscuro && styles.conteudoAbaLateralEscuro, { transform: [{ translateX: animacaoX }] }]}>
            <View style={styles.topoAba}>
              <Text style={[styles.tituloAba, modoEscuro && styles.textoEscuro]}>Perfil</Text>
              <TouchableOpacity onPress={fecharAba}>
                <Ionicons name="close" size={24} color={modoEscuro ? '#AAAAAA' : '#666666'} />
              </TouchableOpacity>
            </View>

            <View style={[styles.divisor, modoEscuro && styles.divisorEscuro]} />

            {/* Interruptor simples sem fundo e posicionado no canto direito */}
            <View style={styles.linhaSwitchLimpa}>
              <Ionicons
                name={modoEscuro ? 'moon' : 'sunny'}
                size={18}
                color={modoEscuro ? '#FFD54F' : '#D81B60'}
                style={{ marginRight: 6 }}
              />
              <Switch
                value={modoEscuro}
                onValueChange={alternarTema}
                trackColor={{ false: '#E0E0E0', true: '#D81B60' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {usuarioLogado ? (
              <View style={styles.caixaConteudoAba}>
                <Image
                  source={{ uri: uriFoto || 'https://avatar.iran.liara.run/public/65' }}
                  style={styles.fotoCirculoAba}
                />
                <Text style={[styles.nomeUsuarioAba, modoEscuro && styles.textoEscuro]}>{dadosPerfil.nome || 'Usuário'}</Text>
                <Text style={[styles.emailUsuarioAba, modoEscuro && styles.textoSecundarioEscuro]}>{dadosPerfil.email}</Text>

                <TouchableOpacity
                  style={styles.botaoAbaPrincipal}
                  onPress={() => {
                    setAbaPerfilVisivel(false);
                    irParaPerfilCompleto();
                  }}
                >
                  <Text style={styles.textoBotaoAbaPrincipal}>Ver Perfil Completo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoAbaSair}
                  onPress={() => {
                    setAbaPerfilVisivel(false);
                    aoSair();
                  }}
                >
                  <Ionicons name="log-out-outline" size={18} color="#E53935" style={{ marginRight: 6 }} />
                  <Text style={styles.textoBotaoAbaSair}>Sair da Conta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.caixaConteudoAba}>
                <View style={[styles.circuloPessoinha, modoEscuro && styles.circuloPessoinhaEscuro]}>
                  <Ionicons name="person" size={40} color="#D81B60" />
                </View>

                <Text style={[styles.avisoNaoCadastrado, modoEscuro && styles.textoSecundarioEscuro]}>
                  Você ainda não está conectado à sua conta.
                </Text>

                <TouchableOpacity
                  style={styles.botaoAbaPrincipal}
                  onPress={() => {
                    setAbaPerfilVisivel(false);
                    irParaLogin();
                  }}
                >
                  <Text style={styles.textoBotaoAbaPrincipal}>Entrar na Conta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkCriarContaAba}
                  onPress={() => {
                    setAbaPerfilVisivel(false);
                    irParaCadastro();
                  }}
                >
                  <Text style={[styles.textoLinkCriarConta, modoEscuro && styles.textoSecundarioEscuro]}>
                    Ainda não tem conta? <Text style={styles.destaqueLink}>Cadastre-se</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={styles.fundoModal}>
          <View style={[styles.caixaModal, modoEscuro && styles.caixaModalEscuro]}>
            <Text style={[styles.tituloModal, modoEscuro && styles.textoEscuro]}>Editar Tarefa</Text>
            <TextInput
              style={[styles.inputModal, modoEscuro && styles.inputModalEscuro]}
              value={novoTexto}
              onChangeText={setNovoTexto}
            />
            <View style={styles.botoesModal}>
              <TouchableOpacity style={styles.botaoModalCancelar} onPress={() => setModalVisivel(false)}>
                <Text style={styles.textoModalCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoModalSalvar} onPress={salvarEdicao}>
                <Text style={styles.textoModalSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingHorizontal: 20,
    paddingTop: 65,
  },
  fundoEscuro: {
    backgroundColor: '#121212',
  },
  topoNavegacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloApp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  textoEscuro: {
    color: '#FFFFFF',
  },
  textoSecundarioEscuro: {
    color: '#AAAAAA',
  },
  botaoPerfil: {
    padding: 2,
    marginRight: 12,
  },
  fotoTopoCirculo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D81B60',
  },
  caixaContador: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0D0D8',
    paddingBottom: 12,
  },
  caixaContadorEscuro: {
    borderBottomColor: '#333333',
  },
  textoContador: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  caixaInputAdd: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0D0D8',
    borderRadius: 8,
    marginBottom: 22,
    overflow: 'hidden',
  },
  caixaInputAddEscuro: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  inputTarefa: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333333',
  },
  botaoAdd: {
    backgroundColor: '#D81B60',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoAdd: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listaContainer: {
    paddingBottom: 24,
  },
  itemLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemLinhaEscuro: {
    backgroundColor: '#1E1E1E',
    borderColor: '#2A2A2A',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: '#F0A0B5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxMarcado: {
    backgroundColor: '#D81B60',
    borderColor: '#D81B60',
  },
  textoCheck: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  textoTarefa: {
    flex: 1,
    fontSize: 15,
    color: '#444444',
  },
  textoRisocado: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  botaoAcao: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
  },
  textoAcaoEditar: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  textoAcaoExcluir: {
    fontSize: 13,
    color: '#E53935',
    fontWeight: '500',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#888888',
    paddingTop: 50,
    fontSize: 14,
  },
  fundoAbaOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  areaTransparente: {
    flex: 1,
  },
  conteudoAbaLateral: {
    width: LARGURA_ABA,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 55,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    height: '100%',
  },
  conteudoAbaLateralEscuro: {
    backgroundColor: '#1E1E1E',
  },
  topoAba: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloAba: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  divisor: {
    height: 1,
    backgroundColor: '#F0D0D8',
    marginTop: 16,
    marginBottom: 8,
  },
  divisorEscuro: {
    backgroundColor: '#333333',
  },
  linhaSwitchLimpa: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  caixaConteudoAba: {
    alignItems: 'center',
    paddingTop: 4,
  },
  circuloPessoinha: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF0F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0D0D8',
  },
  circuloPessoinhaEscuro: {
    backgroundColor: '#2A2A2A',
    borderColor: '#333333',
  },
  fotoCirculoAba: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#D81B60',
    backgroundColor: '#F5F5F5',
    marginBottom: 10,
  },
  nomeUsuarioAba: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  emailUsuarioAba: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 20,
  },
  avisoNaoCadastrado: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  botaoAbaPrincipal: {
    backgroundColor: '#D81B60',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotaoAbaPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  linkCriarContaAba: {
    paddingVertical: 6,
  },
  textoLinkCriarConta: {
    color: '#666666',
    fontSize: 13,
  },
  destaqueLink: {
    color: '#D81B60',
    fontWeight: '600',
  },
  botaoAbaSair: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },
  textoBotaoAbaSair: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  caixaModal: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0D0D8',
  },
  caixaModalEscuro: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333333',
  },
  inputModal: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
    color: '#333333',
  },
  inputModalEscuro: {
    borderColor: '#333333',
    color: '#FFFFFF',
    backgroundColor: '#2A2A2A',
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  botaoModalCancelar: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  textoModalCancelar: {
    fontWeight: '600',
    color: '#666666',
    fontSize: 14,
  },
  botaoModalSalvar: {
    backgroundColor: '#D81B60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  textoModalSalvar: {
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 14,
  },
});