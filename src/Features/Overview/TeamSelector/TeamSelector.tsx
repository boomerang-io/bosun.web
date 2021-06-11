import React from "react";
import { useMutation, queryCache } from "react-query";
import { useFeature } from "flagged";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  ComboBox,
  TextInput,
  Button,
  ComposedModal,
  ModalFooter,
  ModalBody,
  ModalForm,
  Loading,
  InlineNotification,
  notify,
  ToastNotification,
} from "@boomerang-io/carbon-addons-boomerang-react";
import { FeatureFlag } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { Add16 } from "@carbon/icons-react";
import { PolicyTeam } from "Types";
import styles from "./TeamSelector.module.scss";

type Props = {
  activeTeam?: PolicyTeam | null;
  handleChangeTeam: (...args: any[]) => void;
  teams: PolicyTeam[];
};

export function TeamSelector({ activeTeam, handleChangeTeam, teams }: Props) {
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);
  const [requestError, setRequestError] = React.useState<boolean>(false);
  const isStandaloneMode = useFeature(FeatureFlag.Standalone);
  const cancelRequestRef = React.useRef<any>();

  const [createTeamMutation, { isLoading: createIsLoading, error: createError }] = useMutation(
    (args: { body: { name: string } }) => {
      const { promise, cancel } = resolver.postCreateTeam(args);
      cancelRequestRef.current = cancel;
      return promise;
    },
    {
      onSuccess: () => queryCache.invalidateQueries(serviceUrl.getTeams()),
    }
  );

  const selectedTeam = activeTeam
    ? {
        id: activeTeam.id,
        label: activeTeam.name,
        name: activeTeam.name,
      }
    : null;
  const teamsList = teams.map((team) => ({
    id: team.id,
    label: team.name,
    name: team.name,
  }));

  const teamNames = teams.map((team) => team.name);

  async function createTeam(body: { name: string }) {
    try {
      await createTeamMutation({ body });
      notify(<ToastNotification kind="success" title="Team Created" subtitle="Team successfully created" />);
      setModalIsOpen(false);
    } catch (e) {
      setRequestError(true);
      notify(<ToastNotification kind="error" title="Team Creation Failure" subtitle="Request to create team failed" />);
    }
  }

  return (
    <section className={styles.container}>
      <div className={styles.inputs}>
        <ComboBox
          id="team"
          onChange={handleChangeTeam}
          items={teamsList}
          labelText="Team"
          initialSelectedItem={selectedTeam}
          placeholder="Select a team"
          title="Team"
        />
        {isStandaloneMode ? (
          <Formik
            onSubmit={createTeam}
            initialValues={{ name: "" }}
            validateOnMount={false}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Enter a name").notOneOf(teamNames, "Name must be unique"),
            })}
            enableReinitialize
          >
            {(formikProps) => {
              const {
                isSubmitting,
                values,
                touched,
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                resetForm,
              } = formikProps;
              return (
                <>
                  <Button
                    renderIcon={Add16}
                    iconDescription="Add team"
                    onClick={() => setModalIsOpen(true)}
                    size="small"
                  >
                    Create Team
                  </Button>
                  <form onSubmit={handleSubmit}>
                    <ComposedModal
                      composedModalProps={{ containerClassName: styles.modalForm }}
                      modalHeaderProps={{
                        title: "Create team",
                        subtitle: "Add a new one",
                      }}
                      onCloseModal={() => {
                        resetForm();
                        setRequestError(false);
                        setModalIsOpen(false);
                      }}
                      isOpen={modalIsOpen}
                    >
                      {() => (
                        <ModalForm>
                          <ModalBody>
                            <TextInput
                              id="name"
                              placeholder="Enter team name"
                              labelText="Name"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={errors.name && touched.name}
                              invalidText={errors.name}
                              value={values.name}
                            />
                            {requestError && (
                              <InlineNotification
                                lowContrast
                                kind="error"
                                title="Something's Wrong"
                                subtitle="Request to create version failed"
                                onCloseButtonClick={() => setRequestError(false)}
                              />
                            )}
                          </ModalBody>
                          {createIsLoading && <Loading />}
                          <ModalFooter>
                            <Button onClick={() => setModalIsOpen(false)} kind="secondary">
                              Cancel
                            </Button>
                            <Button
                              disabled={!values.name || Object.values(errors).length || isSubmitting}
                              type="submit"
                            >
                              {createIsLoading ? "Creating" : createError ? "Try Again" : "Create"}
                            </Button>
                          </ModalFooter>
                        </ModalForm>
                      )}
                    </ComposedModal>
                  </form>
                </>
              );
            }}
          </Formik>
        ) : null}
      </div>
    </section>
  );
}

export default TeamSelector;
