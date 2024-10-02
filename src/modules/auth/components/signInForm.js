"use client";

import styles from "../../../app/styles/form.module.css";
import Link from 'next/link';
import { FaUser, FaArrowAltCircleRight, FaArrowAltCircleLeft, FaCheck } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { GiPadlock } from "react-icons/gi";
import React, { useState } from "react";
import { useForm, useFormContext } from 'react-hook-form';
import { createAccount } from "@/modules/auth/actions/authActions";
import MaskedInput, { Masks } from "@/app/masks/maskedInputs";
import axios from "axios";

const steps = [
    { id: 'Step-1', name: 'Individual', icon: <FaUser /> },
    { id: 'Step-2', name: 'Address', icon: <IoLocationSharp /> },
    { id: 'Step-3', name: 'Password', icon: <GiPadlock /> },
    { id: 'Step-4', name: 'Complete', icon: <FaCheck /> }
];

export default function SignInForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, getValues, setValue, formState: { errors, isValid }, trigger } = useForm({ mode: 'onChange' });

    const validateStep = async (step) => {
        const result = await trigger();
        if (!result) return false;

        if (step === 0) {
            return Boolean(getValues('fullName') && getValues('cpf') && getValues('birthDay'));
        }
        if (step === 1) {
            return Boolean(getValues('cep') && getValues('state') && getValues('city') && getValues('street'));
        }
        if (step === 2) {
            return Boolean(getValues('password') && getValues('email'));
        }
        return true;
    };


    const onSubmit = async (data) => {
        try {
            await createAccount(data);
        } catch (error) {
            console.error(error);
        }
    };

    const nextButton = async () => {
        const isValidStep = await validateStep(currentStep);
        if (isValidStep && currentStep < steps.length - 1) {
            handleStepChange(currentStep + 1);
        }
    };

    const previousButton = () => {
        if (currentStep > 0) {
            handleStepChange(currentStep - 1);
        }
    };

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        if (newStep === steps.length - 1) {
            handleSubmit(onSubmit)();
        }
    };

    const adressByCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (response.data && !response.data.erro) {
                setValue('street', response.data.logradouro);
                setValue('city',   response.data.localidade);
                setValue('state',  response.data.uf);
            } else {
                console.error('CEP não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar o endereço:', error);
        }
    };

    return (
        <section className={styles.stepSection}>
            <ul className={styles.stepList}>
                {steps.map((step, index) => (
                    <li
                        className={`${styles.stepItems} ${currentStep === index ? styles.currentItem : ''}`}
                        key={step.id}
                    >
                        <span className={styles.progressCount}>
                            {step.icon}
                        </span>
                        <span className={styles.progressLabel}>{step.name}</span>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.formItems}>
                {currentStep === 0 && (
                    <>
                        <h2 className={styles.formTitle}>Personal Information</h2>
                        <p className={styles.formSubTitle}>Individual Details</p>
                        <div className={styles.formContent}>
                            <label className={styles.formText}>Full Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="fullName"
                                name="fullName"
                                {...register("fullName", { required: "Full Name is required" })}
                                required={true}
                            />

                            <label className={styles.formText}>CPF</label>
                            <MaskedInput
                                mask={Masks.cpf}
                                className={styles.formInput}
                                placeholder='Digite o seu CPF'
                                id="cpf"
                                name="cpf"
                                {...register('cpf', { required: "CPF is required" })}
                                required={true}
                            />
                            <label className={styles.formText}>Date of Birth</label>
                            <input
                                type="date"
                                className={styles.formInput}
                                id="birthDay"
                                name="birthDay"
                                {...register("birthDay", { required: "Date of Birth is required" })}
                                required={true}
                            />
                        </div>
                        <div className={styles.arrowContainer}>
                            <Link href="/" className={styles.link}>
                                <button className={styles.formSignIn_Button}>back to start page</button>
                            </Link>
                            <button
                                type="button"
                                onClick={nextButton}
                                disabled={currentStep === steps.length - 1}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleRight />
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <h2 className={styles.formTitle}>Address</h2>
                        <p className={styles.formSubTitle}>Address Details</p>
                        <div className={styles.formContent}>
                            <label className={styles.formText}>CEP</label>
                            <MaskedInput
                                mask={Masks.cep}
                                className={styles.formInput}
                                placeholder='Código Postal'
                                id="cep"
                                name="cep"
                                {...register('cep', { required: "CEP is required" })}
                                required={true}
                                onChange={(e) => {
                                    const cep = e.target.value.replace(/\D/g, '');
                                    setValue('cep', e.target.value);
                                    if (cep.length === 8) { 
                                        adressByCep(cep);
                                    }
                                }}
                            />

                            <label className={styles.formText}>State</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="state"
                                name="state"
                                {...register("state")}
                                readOnly
                                required={true}
                            />
                            <label className={styles.formText}>City</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="city"
                                name="city"
                                {...register("city")}
                                readOnly
                                required={true}
                            />
                            <label className={styles.formText}>Street</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="street"
                                name="street"
                                {...register("street")}
                                readOnly
                                required={true}
                            />
                            <label className={styles.formText}>Number</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="number"
                                name="number"
                                {...register("number", { required: "number is required" })}
                                required={true}
                            />
                        </div>
                        <div className={styles.arrowContainer}>
                            <button
                                type="button"
                                onClick={previousButton}
                                disabled={currentStep === 0}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleLeft />
                            </button>
                            <button
                                type="button"
                                onClick={nextButton}
                                disabled={currentStep === steps.length - 1}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleRight />
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <h2 className={styles.formTitle}>Password</h2>
                        <p className={styles.formSubTitle}>Email & Password</p>
                        <div className={styles.formContent}>
                            <label className={styles.formText}>Password</label>
                            <input
                                type="password"
                                className={styles.formInput}
                                id="password"
                                name="password"
                                {...register("password", { required: "Password is required" })}
                                required={true}
                            />
                            <label className={styles.formText}>Email Address</label>
                            <input
                                type="email"
                                className={styles.formInput}
                                id="email"
                                name="email"
                                {...register("email", { required: "Email is required" })}
                                required={true}
                            />
                        </div>
                        <div className={styles.arrowContainer}>
                            <button
                                type="button"
                                onClick={previousButton}
                                disabled={currentStep === 0}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleLeft />
                            </button>
                            <button
                                type="button"
                                onClick={nextButton}
                                disabled={currentStep === steps.length - 1}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleRight />
                            </button>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <h2 className={styles.formTitle}>Sign In</h2>
                        <p className={styles.formSubTitle}>Complete</p>
                        <div className={styles.arrowContainer}>
                            <button
                                type="button"
                                onClick={previousButton}
                                disabled={currentStep === 0}
                                className={styles.navigationButton}
                            >
                                <FaArrowAltCircleLeft />
                            </button>
                            <button className={styles.formSignIn_Button} type="submit">
                                Sign In
                            </button>
                        </div>
                    </>
                )}
            </form>
        </section>
    );
}
