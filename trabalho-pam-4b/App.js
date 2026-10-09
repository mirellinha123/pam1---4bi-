import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './components/login.js';
import Cadastro from './components/cadastro.js';
import EsqueciSenha from './components/esqueciSenha.js';
import Tarefas from './components/tarefa.js';
import Perfil from './components/perfil.js';

export default function App() {
  const [tela, setTela] = useState('tarefas');
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(false);

  const [emailCadastrado, setEmailCadastrado] = useState('');
  const [senhaCadastrada, setSenhaCadastrada] = useState('');
  const [nomeCadastrado, setNomeCadastrado] = useState('');
  const [fotoCadastrada, setFotoCadastrada] = useState('');

  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  const [textoTarefa, setTextoTarefa] = useState('');
  const [listaTarefas, setListaTarefas] = useState([]);

  // Retorna a chave do AsyncStorage baseada no e-mail do usuário logado
  function obterChaveTarefas(email) {
    return email ? `@lista_tarefas_${email}` : '@lista_tarefas_convidado';
  }

  useEffect(() => {
    async function carregarDadosSalvos() {
      try {
        const emailSalvo = await AsyncStorage.getItem('@email_usuario');
        const senhaSalva = await AsyncStorage.getItem('@senha_usuario');
        const nomeSalvo = await AsyncStorage.getItem('@nome_usuario');
        const fotoSalva = await AsyncStorage.getItem('@foto_usuario');
        const temaSalvo = await AsyncStorage.getItem('@modo_escuro');

        if (emailSalvo) {
          setEmailCadastrado(emailSalvo);
          setEmailInput(emailSalvo);
        }
        if (senhaSalva) setSenhaCadastrada(senhaSalva);
        if (nomeSalvo) setNomeCadastrado(nomeSalvo);
        if (fotoSalva) setFotoCadastrada(fotoSalva);
        if (temaSalvo !== null) setModoEscuro(JSON.parse(temaSalvo));

        const tarefasSalvas = await AsyncStorage.getItem(
          '@lista_tarefas_convidado'
        );
        if (tarefasSalvas) setListaTarefas(JSON.parse(tarefasSalvas));
      } catch (erro) {
        console.log('Erro ao carregar dados:', erro);
      }
    }

    carregarDadosSalvos();
  }, []);

  async function carregarDadosSalvos() {
    try {
      const emailSalvo = await AsyncStorage.getItem('@email_usuario');
      const senhaSalva = await AsyncStorage.getItem('@senha_usuario');
      const nomeSalvo = await AsyncStorage.getItem('@nome_usuario');
      const fotoSalva = await AsyncStorage.getItem('@foto_usuario');
      const temaSalvo = await AsyncStorage.getItem('@modo_escuro');

      if (emailSalvo) {
        setEmailCadastrado(emailSalvo);
        setEmailInput(emailSalvo);
      }
      if (senhaSalva) setSenhaCadastrada(senhaSalva);
      if (nomeSalvo) setNomeCadastrado(nomeSalvo);
      if (fotoSalva) setFotoCadastrada(fotoSalva);
      if (temaSalvo !== null) setModoEscuro(JSON.parse(temaSalvo));

      // Carrega as tarefas de convidado ao iniciar
      const tarefasSalvas = await AsyncStorage.getItem(obterChaveTarefas(''));
      if (tarefasSalvas) setListaTarefas(JSON.parse(tarefasSalvas));
    } catch (erro) {
      console.log('Erro ao carregar dados:', erro);
    }
  }

  async function carregarTarefasDoUsuario(email) {
    try {
      const chave = obterChaveTarefas(email);
      const tarefasSalvas = await AsyncStorage.getItem(chave);
      if (tarefasSalvas) {
        setListaTarefas(JSON.parse(tarefasSalvas));
      } else {
        setListaTarefas([]);
      }
    } catch (erro) {
      console.log('Erro ao carregar tarefas do usuário:', erro);
    }
  }

  async function alternarTema() {
    try {
      const novoModo = !modoEscuro;
      setModoEscuro(novoModo);
      await AsyncStorage.setItem('@modo_escuro', JSON.stringify(novoModo));
    } catch (erro) {
      console.log('Erro ao salvar tema:', erro);
    }
  }

  async function cadastrarUsuario(novoEmail, novaSenha, novoNome) {
    try {
      await AsyncStorage.setItem('@email_usuario', novoEmail);
      await AsyncStorage.setItem('@senha_usuario', novaSenha);
      if (novoNome) await AsyncStorage.setItem('@nome_usuario', novoNome);

      setEmailCadastrado(novoEmail);
      setSenhaCadastrada(novaSenha);
      if (novoNome) setNomeCadastrado(novoNome);

      setEmailInput(novoEmail);
      setMensagemErro('');
      Alert.alert('Sucesso', 'Conta criada! Entre com sua senha.');
      setTela('login');
    } catch (erro) {
      console.log('Erro ao salvar cadastro:', erro);
    }
  }

  async function fazerLogin() {
    if (!emailInput.trim() || !senhaInput.trim()) {
      setMensagemErro('Preencha o e-mail e a senha!');
      return;
    }

    if (!emailCadastrado) {
      setMensagemErro('Você não tem uma conta. Crie uma antes de entrar!');
      return;
    }

    if (emailInput !== emailCadastrado || senhaInput !== senhaCadastrada) {
      setMensagemErro('E-mail ou senha incorretos!');
      return;
    }

    setMensagemErro('');
    setUsuarioLogado(true);
    await carregarTarefasDoUsuario(emailInput);
    setTela('tarefas');
  }

  async function redefinirSenha(emailInformado, novaSenha) {
    if (emailInformado !== emailCadastrado) {
      Alert.alert('Erro', 'E-mail não encontrado!');
      return;
    }

    try {
      await AsyncStorage.setItem('@senha_usuario', novaSenha);
      setSenhaCadastrada(novaSenha);
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
      setTela('login');
    } catch (erro) {
      console.log('Erro ao redefinir senha:', erro);
    }
  }

  async function fazerLogout() {
    setSenhaInput('');
    setUsuarioLogado(false);
    setMensagemErro('');
    await carregarTarefasDoUsuario('');
    setTela('tarefas');
  }

  async function adicionarTarefa() {
    if (!textoTarefa.trim()) return;

    const nova = {
      id: String(Date.now()),
      texto: textoTarefa,
      concluida: false,
    };

    const novaLista = [...listaTarefas, nova];
    setListaTarefas(novaLista);
    setTextoTarefa('');

    const chave = obterChaveTarefas(usuarioLogado ? emailCadastrado : '');
    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
  }

  async function deletarTarefa(id) {
    const novaLista = listaTarefas.filter((item) => item.id !== id);
    setListaTarefas(novaLista);

    const chave = obterChaveTarefas(usuarioLogado ? emailCadastrado : '');
    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
  }

  async function alternarConcluida(id) {
    const novaLista = listaTarefas.map((item) =>
      item.id === id ? { ...item, concluida: !item.concluida } : item
    );
    setListaTarefas(novaLista);

    const chave = obterChaveTarefas(usuarioLogado ? emailCadastrado : '');
    await AsyncStorage.setItem(chave, JSON.stringify(novaLista));
  }

  function atualizarPerfilGeral(novoEmail, novoNome, novaFoto) {
    if (novoEmail) setEmailCadastrado(novoEmail);
    if (novoNome) setNomeCadastrado(novoNome);
    if (novaFoto) setFotoCadastrada(novaFoto);
  }

  return (
    <SafeAreaView
      style={[styles.container, modoEscuro && styles.containerEscuro]}>
      {tela === 'tarefas' && (
        <Tarefas
          textoTarefa={textoTarefa}
          setTextoTarefa={setTextoTarefa}
          listaTarefas={listaTarefas}
          adicionarTarefa={adicionarTarefa}
          deletarTarefa={deletarTarefa}
          alternarConcluida={alternarConcluida}
          usuarioLogado={usuarioLogado}
          dadosPerfil={{
            nome: nomeCadastrado,
            email: emailCadastrado,
            foto: fotoCadastrada,
          }}
          modoEscuro={modoEscuro}
          alternarTema={alternarTema}
          irParaLogin={() => setTela('login')}
          irParaCadastro={() => setTela('cadastro')}
          irParaPerfilCompleto={() => setTela('perfil')}
          aoSair={fazerLogout}
        />
      )}

      {tela === 'login' && (
        <Login
          email={emailInput}
          setEmail={setEmailInput}
          senha={senhaInput}
          setSenha={setSenhaInput}
          mensagemErro={mensagemErro}
          modoEscuro={modoEscuro}
          aoFazerLogin={fazerLogin}
          aoIrParaEsqueciSenha={() => setTela('esqueciSenha')}
          aoIrParaCadastro={() => {
            setMensagemErro('');
            setTela('cadastro');
          }}
          aoVoltar={() => setTela('tarefas')}
        />
      )}

      {tela === 'cadastro' && (
        <Cadastro
          modoEscuro={modoEscuro}
          aoCadastrar={cadastrarUsuario}
          aoVoltar={() => setTela('login')}
        />
      )}

      {tela === 'esqueciSenha' && (
        <EsqueciSenha
          modoEscuro={modoEscuro}
          aoRedefinirSenha={redefinirSenha}
          aoVoltar={() => setTela('login')}
        />
      )}

      {tela === 'perfil' && (
        <Perfil
          email={emailCadastrado}
          modoEscuro={modoEscuro}
          aoSalvarPerfil={atualizarPerfilGeral}
          aoSair={fazerLogout}
          aoVoltar={() => setTela('tarefas')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  containerEscuro: {
    backgroundColor: '#121212',
  },
});
